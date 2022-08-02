import type { Pointer } from 'ref-napi';
import constants from './constants';
import libmagic from './libmagic';
import { promisify } from 'util';

const configMap = {
    debug: constants.MAGIC_DEBUG,
    followSymlink: constants.MAGIC_SYMLINK,
    checkInsideCompressedFiles: constants.MAGIC_COMPRESS,
    checkInsideDeviceFiles: constants.MAGIC_DEVICES,
    returnMimeType: constants.MAGIC_MIME,
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
        flag: 0
    };

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
            writable: true,
        });
    }

    return obj;
}

const pMagicLoad = promisify(libmagic.magic_load);

export class LibmagicIO {

    handle: Pointer<void>;
    flag: number = 0;

    protected loaded = false;

    constructor() {
        this.handle = libmagic.magic_open(0);
    }

    async load(path?: string) {
        if (this.loaded) {
            return;
        }

        const r = await pMagicLoad(this.handle, path || null);
        if (r === -1) {
            const errMsg = libmagic.magic_error(this.handle);
            throw new Error(errMsg ? `libmagic: ${errMsg}` : 'Unknown libmagic error');
        }
        this.loaded = true;
    }

}
