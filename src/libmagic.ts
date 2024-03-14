import koffi from 'koffi';
import constants from './constants';
import fs from 'fs';

// magic_t is a pointer to a `magic_set` struct
// which should be treated as opaque
export const magic_t = koffi.opaque();
export const magic_t_ptr = koffi.pointer(magic_t);

let dlOpenPath = 'libmagic';
switch (process.platform) {
    case 'darwin': {
        // MacOS being special for `LD_LIBRARY_PATH` etc is not very effective.
        // MacOS arm64 even special for its library not linked to common places.
        if (process.arch === 'arm64') {
            if (fs.existsSync('/opt/homebrew/lib/libmagic.dylib')) {
                dlOpenPath = '/opt/homebrew/lib/libmagic.dylib';
            }
        }
        break;
    }
    case 'linux': {
        dlOpenPath = 'libmagic.so.1';
        break;
    }
    default: {
        break;
    }
}

let sharedLib;
let lastError;

const PLATFORM_SPECIFIC_SUFFIX = {
    win32: '.dll',
    darwin: '.dylib',
    linux: '.so',
};

const dynamicLibSuffix = Reflect.get(PLATFORM_SPECIFIC_SUFFIX, process.platform) || '.so';

for (const x of [dlOpenPath, 'libmagic.1', 'libmagic'] as const) {
    const fl = x.toLowerCase();
    const fixedName = (fl.includes(`${dynamicLibSuffix}.`) || fl.endsWith(dynamicLibSuffix)) ? x : x + dynamicLibSuffix;

    try {
        sharedLib = koffi.load(fixedName);

        break;
    } catch (err) {
        lastError = err;
        continue;
    }
}

if (!sharedLib) {
    throw lastError;
}

export const libmagic = {
    ...constants,
    magic_open: sharedLib.func('magic_open', magic_t_ptr, ['int']),
    magic_close: sharedLib.func('magic_close', 'void', [magic_t_ptr]),
    magic_getpath: sharedLib.func('magic_getpath', 'string', ['string', 'int']),
    magic_file: sharedLib.func('magic_file', 'string', [magic_t_ptr, 'string']),
    magic_descriptor: sharedLib.func('magic_descriptor', 'string', [magic_t_ptr, 'int']),
    magic_buffer: sharedLib.func('magic_buffer', 'string', [magic_t_ptr, 'void*', 'size_t']),
    magic_error: sharedLib.func('magic_error', 'string', [magic_t_ptr]),
    magic_getflags: sharedLib.func('magic_getflags', 'int', [magic_t_ptr]),
    magic_setflags: sharedLib.func('magic_setflags', 'int', [magic_t_ptr, 'int']),
    magic_version: sharedLib.func('magic_version', 'int', []),
    magic_load: sharedLib.func('magic_load', 'int', [magic_t_ptr, 'string']),
    magic_load_buffers: sharedLib.func('magic_load_buffers', 'int', [magic_t_ptr, 'void**', 'size_t*', 'size_t']),
    magic_compile: sharedLib.func('magic_compile', 'int', [magic_t_ptr, 'string']),
    magic_check: sharedLib.func('magic_check', 'int', [magic_t_ptr, 'string']),
    magic_list: sharedLib.func('magic_list', 'int', [magic_t_ptr, 'string']),
    magic_errno: sharedLib.func('magic_errno', 'int', [magic_t_ptr]),
    magic_setparam: sharedLib.func('magic_setparam', 'int', [magic_t_ptr, 'int', 'void*']),
    magic_getparam: sharedLib.func('magic_getparam', 'int', [magic_t_ptr, 'int', 'void*']),
};

export default libmagic;



