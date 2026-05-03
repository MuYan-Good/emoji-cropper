export const DEFAULT_OUTPUT_WIDTH = 240
export const DEFAULT_OUTPUT_HEIGHT = 240

export const DEFAULT_OUTPUT_SIZE = {
  width: DEFAULT_OUTPUT_WIDTH,
  height: DEFAULT_OUTPUT_HEIGHT,
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024

export const SUPPORTED_TYPES = ['image/png', 'image/gif'] as const

export const FILE_NAME_PREFIX = 'emoji'

export const COMPRESS_QUALITY_DEFAULT = 80

export const COMPRESS_SCALE_PRESETS = [25, 50, 75, 100] as const

export const COMPRESS_SUPPORTED_INPUT_TYPES = ['image/png', 'image/jpeg', 'image/gif'] as const

export const COMPRESS_MAX_FILES = 20
