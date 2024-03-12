import constants from './constants';
import { libmagic } from './libmagic';
import { promisify } from 'util';
import path from 'path';
import pool from 'generic-pool'

const configMap = {
    debug: constants.MAGIC_DEBUG,
    followSymlink: constants.MAGIC_SYMLINK,
    checkInsideCompressedFiles: constants.MAGIC_COMPRESS,
    checkInsideDeviceFiles: constants.MAGIC_DEVICES,
    returnMimeType: constants.MAGIC_MIME_TYPE,
    returnAllMatches: constants.MAGIC_CONTINUE,
    printWarningsToStdErr: constants.MAGIC_CHECK,
    preserveATime: constants.MAGIC_PRESERVE_ATIME,
    noConvertUnprintableChars: constants.MAGIC_RAW,
    throwError: constants.MAGIC_ERROR,
    returnMimeEncoding: constants.MAGIC_MIME_ENCODING,
    returnContentType: constants.MAGIC_MIME,
    returnAppleCreatorType: constants.MAGIC_APPLE,
    returnExtensions: constants.MAGIC_EXTENSION,
    checkInsideCompressedFilesButNotReportCompression: constants.MAGIC_COMPRESS_TRANSP,
    nodesc: constants.MAGIC_NODESC,

    noCheckCompressedFiles: constants.MAGIC_NO_CHECK_COMPRESS,
    noCheckTarFiles: constants.MAGIC_NO_CHECK_TAR,
    noCheckExternalEntries: constants.MAGIC_NO_CHECK_SOFT,
    noCheckApplicationType: constants.MAGIC_NO_CHECK_APPTYPE,
    noCheckElfDetails: constants.MAGIC_NO_CHECK_ELF,
    noCheckTextFiles: constants.MAGIC_NO_CHECK_TEXT,
    noCheckCdfFiles: constants.MAGIC_NO_CHECK_CDF,
    noCheckCSVFiles: constants.MAGIC_NO_CHECK_CSV,
    noCheckTokens: constants.MAGIC_NO_CHECK_TOKENS,
    noCheckTextEncoding: constants.MAGIC_NO_CHECK_ENCODING,
    noCheckJSON: constants.MAGIC_NO_CHECK_JSON,

    noCheckBuiltin: constants.MAGIC_NO_CHECK_BUILTIN,
}

function getConfigObj() {
    const obj = {
        flag: 0,
    } as { [k in keyof typeof configMap]: boolean } & { flag: number };

    for (const [k, v] of Object.entries(configMap)) {
        Object.defineProperty(obj, k, {
            get() {
                return (this.flag & v) === v;
            },
            set(input: boolean) {
                if (input) {
                    this.flag |= v;
                } else {
                    this.flag &= ~v;
                }
            },
            enumerable: true,
        });
    }

    return obj;
}

const pMagicVersion = promisify(libmagic.magic_version.async) as ()=> Promise<number>;
const pMagicOpen = promisify(libmagic.magic_open.async) as (flag: number) => Promise<unknown>;
const pMagicClose = promisify(libmagic.magic_close.async) as (handle: unknown) => Promise<void>;
const pMagicLoad = promisify(libmagic.magic_load.async) as (handle: unknown, dbPath: string | null) => Promise<number>;
const pMagicDetectFile = promisify(libmagic.magic_file.async) as (handle: unknown, fpath: string) => Promise<string>;
const pMagicDetectBuffer = promisify(libmagic.magic_buffer.async) as (handle: unknown, buffer: Buffer | Uint8Array, len: number) => Promise<string>;

function magicThrow(handle: unknown): never {
    const errMsg = libmagic.magic_error(handle);
    throw new Error(errMsg ? `libmagic: ${errMsg}` : 'Unknown libmagic error');
}

type Options = ReturnType<typeof getConfigObj> & {
    magicDBPath?: string;
    pool?: pool.Options;
};
export class LibmagicIO {
    pool: pool.Pool<unknown>;

    config: ReturnType<typeof getConfigObj> & {
        magicDBPath?: string;
        pool?: pool.Options;
    };

    constructor(options?: Partial<Options>) {
        this.config = getConfigObj();
        Object.assign(this.config, { pool: { min: 1, max: 10 }, ...options });
        this.pool = pool.createPool({
            create: async () => {
                const handle = await pMagicOpen(this.config.flag);
                const r = await pMagicLoad(handle, this.config.magicDBPath || null);
                if (r === -1) {
                    magicThrow(handle);
                }

                return handle;
            },
            destroy: async (handle) => {
                await pMagicClose(handle);
            },
        }, { ...this.config.pool });
    }

    getLibmagicVersion() {
        return pMagicVersion();
    }

    async close() {
        await this.pool.drain();
        await this.pool.clear();
    }

    async detectFile(fpath: string) {
        const absPath = path.resolve(fpath);

        return this.pool.use(async (handle) => {
            const r = await pMagicDetectFile(handle, absPath);
            if (r === null) {
                magicThrow(handle);
            }

            return r;
        });
    }

    async detectBuffer(buffer: Buffer | Uint8Array) {
        return this.pool.use(async (handle) => {
            const r = await pMagicDetectBuffer(handle, buffer, buffer.byteLength);
            if (r === null) {
                magicThrow(handle);
            }

            return r;
        });
    }
}
