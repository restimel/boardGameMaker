
type EnumerationType = `enumeration:${string}`;
type EnumerationLoopType = `enumeration-loop:${string}`;
type MaterialType = 'Cards' | 'Dice';
type MaterialPart = 'Box' | 'Image';
type DescriptionType = 'text' | 'number' | 'image' | 'color'
    | EnumerationType | EnumerationLoopType;

type RefOptions = {
    material?: Material;
    content?: MaterialContent | null;
    list?: Set<string>;
};

type MaterialContext = RefOptions & {
    /** The current loop context.
     *
     * { enumId: keyId }
     */
    loop: Record<string, string>;

    project: Project;
}

type CardFormat = {
    name: string;
    dimensions: Dimension;
    usage: string;
};

type MetaTextOptions = {
    size: number;
    color: Color;
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
type ContentValue = string | number | Color | undefined;

type MaterialContent = Record<string, ContentValue>;

type MetaMaterial = {
    type: MaterialPart;
    id: string;
    name: string;
    dimension: Dimension;
    position: Position;
    rotation: Angle;
    content: MetaContent;

    color: Color; /* TODO: To remove (replace by content.color) */
    bgColor: Color;
};

type MaterialDescription = {
    name: string;
    type: DescriptionType;
    defaultValue: string;
};

type MaterialDescriptions = Record<string, MaterialDescription>;

type MaterialBase = {
    name: string;
    type: MaterialType;

    description: MaterialDescriptions;
    contents: Array<MaterialContent>;
};

type MaterialCard = MaterialBase & {
    type: 'Cards';

    dimension: Dimension;
    backgroundColor: Color;
    front: MetaMaterial[];
    back: MetaMaterial[];
};

type MaterialDice = MaterialBase & {
    type: 'Dice';

    faces: number;
    diceColor: Color;
};

type Material = MaterialCard | MaterialDice;

type Alias = {
    id: string;
    alias: string;
    value: string;
    image: string;
};

type KeyValue = {
    id: string;
    key: string;
    value: ContentValue;
}

type Enumeration = {
    id: string;
    name: string;
    type: DescriptionType;
    values: KeyValue[];
    defaultValue: ContentValue;
};

type Project = {
    author: string;
    /** minor change */
    buildVersion: number;

    concept: string;
    setup: string;
    rules: string;
    endOfGame: string;
    score: string;

    playerMin: number;
    playerMax: number;
    playerBest: number;
    playerOptions: string;

    /** minutes */
    duration: number;

    materials: Material[];

    alias: Record<string, Alias>;
    enumerations: Enumeration[];
};

type StateExtended = {
    title: string;
    /** GameProject id */
    id: string;
    version: string;
};

type StateProject = Project & StateExtended;

type StatesKey = keyof Project;
type ProjectStates = {
    [Key in StatesKey]: Ref<Project[Key]>;
} & {
    [Key in keyof StateExtended]: Ref<StateExtended[Key]>;
};

type GameProject = {
    title: string;
    id: string;

    /** key is version: <major>.<minor> */
    versions: Record<string, Project>;
};

type Projects = GameProjects[];
