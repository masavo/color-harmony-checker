export interface ColorCombination {
	id: string;
	name: string;
	leftBackgroundColor: string;
	rightBackgroundColor: string;
	centerSquareColor: string;
	createdAt: Date;
}

export interface ColorPickerStrategy {
	pickColor(): Promise<string>;
}

export interface ColorStorage {
	save(combination: Omit<ColorCombination, 'id' | 'createdAt'>): Promise<ColorCombination>;
	load(id: string): Promise<ColorCombination | null>;
	list(): Promise<ColorCombination[]>;
	delete(id: string): Promise<void>;
	update(id: string, data: Partial<ColorCombination>): Promise<ColorCombination>;
}
