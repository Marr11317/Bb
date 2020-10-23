import { BbChordSymbolParenthesesOptions } from "./bb-chord-symbol-parentheses-options";

/**
 * The options that can be passed to a BbRenderer
 * to modify how it renders chord symbols.
 *
 * @note All numeric values are a multiplier of the font size.
 * @export
 * @class BbChordSymbolOptions
 */
export class BbChordSymbolOptions {
    /**
     * The horizontal inset to apply to the descriptor.
     * The descriptor is everything except the root and bass notes.
     *
     * @note this value is a multiplier of the font size.
     */
    descriptorHorizontalInset: number = 0;
    /**
     * The vertical offset to apply to the descriptor.
     * The descriptor is everything except the root and bass notes.
     *
     * @note this value is a multiplier of the font size.
     */
    descriptorVerticalOffset: number = 0.35;

    /**
     * The vertical margin between extensions.
     * @note this value is a multiplier of the font size.
     */
    extensionsVerticalMargin: number = 0.05;

    /**
     * Options applying to parentheses.
     */
    parentheses = new BbChordSymbolParenthesesOptions();

    /**
     * Options that apply to the separator.
     *
     * The separator is the slash between the quality and the bass note.
     */
    separator = new BbSeparatorOptions();

    /**
     * Apply a relative Y offset to the bass note.
     */
    bassYOffset: number = 0.27;

    /**
     * Wheter to use a '-' sign for minor chords instead of 'mi'
     *
     */
    useMinusSignForMinorChords: boolean = true;
}


/**
 * Separator options.
 *
 * @export
 * @class BbSeparatorOptions
 */
export class BbSeparatorOptions {

    /**
     * Apply a relative Y offset to the separator before the bass note.
     */
    yOffset: number = 0.1;

    /**
     * Inset the separator left.
     */
    leftInset: number = 0.15;

    /**
     * Inset the separator right.
     */
    rightInset: number = 0.1;

    /**
     * This angle in radian will be applied to the separator.
     *
     * Useful if your font's separator is too or not enough slanted.
     *
     * @note that the separator's bounding box is not modified accordingly,
     * and is not giving true results anymore.
     */
    angle: number = 0;

    /**
     * X scale factor.
     */
    scaleX: number = 1.3;
    /**
     * Y scale factor.
     */
    scaleY: number = 1.3;
}
