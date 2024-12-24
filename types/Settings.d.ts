
type PrintMode =
    | 'yes'
    | 'no'
    /* Card material */
    | 'front'
    | 'back';

type Print = Map<string, PrintMode>;
