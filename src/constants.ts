export default {
    MAGIC_NONE: 0x0000000, /* No flags */
    MAGIC_DEBUG: 0x0000001, /* Turn on debugging */
    MAGIC_SYMLINK: 0x0000002, /* Follow symlinks */
    MAGIC_COMPRESS: 0x0000004, /* Check inside compressed files */
    MAGIC_DEVICES: 0x0000008, /* Look at the contents of devices */
    MAGIC_MIME_TYPE: 0x0000010, /* Return the MIME type */
    MAGIC_CONTINUE: 0x0000020, /* Return all matches */
    MAGIC_CHECK: 0x0000040, /* Print warnings to stderr */
    MAGIC_PRESERVE_ATIME: 0x0000080, /* Restore access time on exit */
    MAGIC_RAW: 0x0000100, /* Don't convert unprintable chars */
    MAGIC_ERROR: 0x0000200, /* Handle ENOENT etc as real errors */
    MAGIC_MIME_ENCODING: 0x0000400, /* Return the MIME encoding */
    MAGIC_MIME: (0x0000010 | 0x0000400),
    MAGIC_APPLE: 0x0000800, /* Return the Apple creator/type */
    MAGIC_EXTENSION: 0x1000000, /* Return a separated list of extensions */
    MAGIC_COMPRESS_TRANSP: 0x2000000, /* Check inside compressed files but not report compression */
    MAGIC_NODESC: (0x1000000 | 0x0000010 | 0x0000400 | 0x0000800),

    MAGIC_NO_CHECK_COMPRESS: 0x0001000, /* Don't check for compressed files */
    MAGIC_NO_CHECK_TAR: 0x0002000, /* Don't check for tar files */
    MAGIC_NO_CHECK_SOFT: 0x0004000, /* Don't check magic entries */
    MAGIC_NO_CHECK_APPTYPE: 0x0008000, /* Don't check application type */
    MAGIC_NO_CHECK_ELF: 0x0010000, /* Don't check for elf details */
    MAGIC_NO_CHECK_TEXT: 0x0020000, /* Don't check for text files */
    MAGIC_NO_CHECK_CDF: 0x0040000, /* Don't check for cdf files */
    MAGIC_NO_CHECK_CSV: 0x0080000, /* Don't check for CSV files */
    MAGIC_NO_CHECK_TOKENS: 0x0100000, /* Don't check tokens */
    MAGIC_NO_CHECK_ENCODING: 0x0200000, /* Don't check text encodings */
    MAGIC_NO_CHECK_JSON: 0x0400000, /* Don't check for JSON files */

    /* No built-in tests; only consult the magic file */
    MAGIC_NO_CHECK_BUILTIN: (0
        | 0x0001000
        | 0x0002000
        | 0x0008000
        | 0x0010000
        | 0x0020000
        | 0x0040000
        | 0x0080000
        | 0x0100000
        | 0x0200000
        | 0x0400000
    ),


    MAGIC_PARAM_INDIR_MAX: 0,
    MAGIC_PARAM_NAME_MAX: 1,
    MAGIC_PARAM_ELF_PHNUM_MAX: 2,
    MAGIC_PARAM_ELF_SHNUM_MAX: 3,
    MAGIC_PARAM_ELF_NOTES_MAX: 4,
    MAGIC_PARAM_REGEX_MAX: 5,
    MAGIC_PARAM_BYTES_MAX: 6,
};
