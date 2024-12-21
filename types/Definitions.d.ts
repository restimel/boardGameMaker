
/** [major, minor, variation] */
type Version = [number, number, number];

/** [x, y] in mm */
type Dimension = [number, number];

/** [x, y] in mm */
type Position = [number, number];

/* [x, y] in any unit */
type Point = [number, number];

/** [0, 360] deg */
type Angle = number;

/** [x, y, width, height] */
type Rectangle = [number, number, number, number];

/** [x, y, width, height, rotation] */
type RotationRectangle = [number, number, number, number, number];

type BuildMode = 'new' | 'same' | 'major' | 'minor' | 'build';

type Color = string;
