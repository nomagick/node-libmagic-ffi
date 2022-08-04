import ffi from 'ffi-napi';
import ref from 'ref-napi';
import constants from './constants';
import fs from 'fs';

// magic_t is a pointer to a `magic_set` struct
// which should be treated as opaque
export const magic_t = ref.refType(ref.types.void);
export const ptr = ref.refType(ref.types.void);
export const ptr_ptr = ref.refType(ptr);
export const size_t_ptr = ref.refType(ref.types.size_t);

// MacOS being special for `LD_LIBRARY_PATH` etc is not very effective.
// MacOS arm64 even special for its library not linked to common places.
const dlOpenPath = process.arch === 'arm64' && process.platform === 'darwin' && fs.existsSync('/opt/homebrew/lib/libmagic.dylib') ?
    '/opt/homebrew/lib/libmagic.dylib' : 'libmagic';

export const libmagic = new ffi.Library(dlOpenPath, {
    magic_open: [magic_t, ['int']],
    magic_close: ['void', [magic_t]],

    magic_getpath: ['CString', ['CString', 'int']],

    magic_file: ['CString', [magic_t, 'CString']],
    magic_descriptor: ['CString', [magic_t, 'int']],
    magic_buffer: ['CString', [magic_t, ptr, 'size_t']],

    magic_error: ['CString', [magic_t]],
    magic_getflags: ['int', [magic_t]],
    magic_setflags: ['int', [magic_t, 'int']],

    magic_version: ['int', []],

    magic_load: ['int', [magic_t, 'CString']],
    magic_load_buffers: ['int', [magic_t, ptr_ptr, size_t_ptr, 'size_t']],

    magic_compile: ['int', [magic_t, 'CString']],
    magic_check: ['int', [magic_t, 'CString']],
    magic_list: ['int', [magic_t, 'CString']],

    magic_errno: ['int', [magic_t]],

    magic_setparam: ['int', [magic_t, 'int', ptr]],
    magic_getparam: ['int', [magic_t, 'int', ptr]],

}, constants);

export default libmagic;



