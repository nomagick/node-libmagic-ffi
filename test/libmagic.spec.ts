import { libmagic } from '..';
import path from 'path';
import fs from 'fs';
import type { Pointer } from 'ref-napi';

describe('Basic libmagic ffi bindings', () => {

    it('Loads libmagic', () => {
        expect(libmagic).toBeInstanceOf(Object);
    });

    it('Can read libmagic version', () => {
        expect(libmagic.magic_version()).toBeGreaterThan(0);
    });

    it('Can read default magic path', () => {
        const defaultPath = libmagic.magic_getpath(null, 0);
        expect(defaultPath).toHaveProperty('length');
        expect(defaultPath!.length).toBeGreaterThan(0);
    });

    it('Can open, load, close', () => {
        const handle = libmagic.magic_open(libmagic.MAGIC_SYMLINK | libmagic.MAGIC_MIME);
        const r = libmagic.magic_load(handle, null);
        expect(r).toBe(0);
        libmagic.magic_close(handle);
    });

    it('Can detect json file', () => {
        const handle = libmagic.magic_open(libmagic.MAGIC_SYMLINK | libmagic.MAGIC_MIME);
        libmagic.magic_load(handle, null);
        const r = libmagic.magic_file(handle, path.resolve(__dirname, '..', 'package.json'));
        libmagic.magic_close(handle);
        expect(r).toContain('application/json');
    });

    it('Can detect json buffer', () => {
        const handle = libmagic.magic_open(libmagic.MAGIC_SYMLINK | libmagic.MAGIC_MIME);
        libmagic.magic_load(handle, null);
        const jsonPath = path.resolve(__dirname, '..', 'package.json');
        const buff = fs.readFileSync(jsonPath);
        const r = libmagic.magic_buffer(handle, buff as Pointer<void>, buff.byteLength);
        libmagic.magic_close(handle);
        expect(r).toContain('application/json');
    });

    it('Can detect json file asynchronously', async () => {
        const handle = libmagic.magic_open(libmagic.MAGIC_SYMLINK | libmagic.MAGIC_MIME);
        libmagic.magic_load(handle, null);
        const r = await new Promise((resolve, reject) => {
            libmagic.magic_file.async(handle, path.resolve(__dirname, '..', 'package.json'), (err, r) => {
                if (err) {
                    return reject(err);
                }

                return resolve(r)
            });
        });

        libmagic.magic_close(handle);
        expect(r).toContain('application/json');
    });
});
