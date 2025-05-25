import { ColorCombination, ColorStorage } from '@/types/color';

const STORAGE_KEY = 'color-combinations';

export class LocalStorageColorStorage implements ColorStorage {
	private getStorage(): ColorCombination[] {
		if (typeof window === 'undefined') return [];
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	}

	private setStorage(data: ColorCombination[]): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}

	async save(combination: Omit<ColorCombination, 'id' | 'createdAt'>): Promise<ColorCombination> {
		const storage = this.getStorage();
		const newCombination: ColorCombination = {
			...combination,
			id: crypto.randomUUID(),
			createdAt: new Date(),
		};
		storage.push(newCombination);
		this.setStorage(storage);
		return newCombination;
	}

	async load(id: string): Promise<ColorCombination | null> {
		const storage = this.getStorage();
		return storage.find(item => item.id === id) || null;
	}

	async list(): Promise<ColorCombination[]> {
		return this.getStorage();
	}

	async delete(id: string): Promise<void> {
		const storage = this.getStorage();
		const newStorage = storage.filter(item => item.id !== id);
		this.setStorage(newStorage);
	}

	async update(id: string, data: Partial<ColorCombination>): Promise<ColorCombination> {
		const storage = this.getStorage();
		const index = storage.findIndex(item => item.id === id);
		if (index === -1) throw new Error('Combination not found');

		const updatedCombination = {
			...storage[index],
			...data,
		};
		storage[index] = updatedCombination;
		this.setStorage(storage);
		return updatedCombination;
	}
}
