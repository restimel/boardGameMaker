
type MaterialType = 'Cards' | 'Dice';
type MaterialPart = 'Box' | 'Image';
type DescriptionType = 'text' | 'number' | 'image' | 'color';

/** [x, y] in mm */
type Dimension = [number, number];

/** [x, y] in mm */
type Position = [number, number];

/** x, y, width, height */
type Rectangle = [number, number, number, number];

type CardFormat = {
    name: string;
    dimensions: Dimension;
    usage: string;
};

type MetaTextOptions = {
    size: number;
    color: string;
    alignment: 'center' | 'start' | 'end';
}

type MetaStaticText = MetaTextOptions & {
    type: 'StaticText';
    value: string;
};

type MetaStaticImage = MetaTextOptions & {
    type: 'StaticImage';
    value: string;
};

type MetaReference = MetaTextOptions & {
    type: 'Reference';
    value: string;
    size: number;
};

type MetaContent = MetaReference | MetaStaticText | MetaStaticImage;
type ContentValue = string | number | undefined;

type MaterialContent = Record<string, ContentValue>;

type MetaMaterial = {
    type: MaterialPart;
    id: string;
    name: string;
    dimension: Dimension;
    position: Position;
    content: MetaContent;

    color: string; /* TODO: To remove (replace by content.color) */
    bgColor: string;
};

type MaterialDescription = {
    name: string;
    type: DescriptionType;
    defaultValue: string;
};

type MaterialBase = {
    name: string;
    type: MaterialType;

    description: Record<string, MaterialDescription>;
    contents: Array<MaterialContent>;
};

type MaterialCard = MaterialBase & {
    type: 'Cards';

    dimension: Dimension;
    backgroundColor: string;
    front: MetaMaterial[];
    back: MetaMaterial[];
};

type MaterialDice = MaterialBase & {
    type: 'Dice';

    faces: number;
    diceColor: string;
};

type Material = MaterialCard | MaterialDice;
