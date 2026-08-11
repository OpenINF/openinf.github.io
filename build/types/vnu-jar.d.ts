/**
 * @file Ambient types for vnu-jar, which ships no declarations of its own.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 */

declare module 'vnu-jar' {
  /**
   * The path to the bundled `vnu.jar`, as a boxed String so that the package
   * can hang `vnu` off it. The tasks here interpolate it into a command, which
   * is what makes that work.
   */
  const vnuJar: string & {
    vnu: {
      check(args?: string[], options?: object): Promise<unknown>;
    };
  };

  export default vnuJar;
}
