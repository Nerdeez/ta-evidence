declare module '*.svg' {
  type SvgImport =
    | string
    | {
        src: string;
        width: number;
        height: number;
      };

  const content: SvgImport;
  export default content;
}
