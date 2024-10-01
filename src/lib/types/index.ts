export interface Region {
  id: string;
  name: string;
  d: string;
}

export interface MapData {
  regions: Region[];
  name: string;
}

export interface GameMode {
  name: string;
  description: string;
  component: any; // Replace with the actual Svelte component type
}
