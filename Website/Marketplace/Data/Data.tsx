import { BaseItem } from "../types";






// --- Sample Data ---
export const marketplaceListingsJson: BaseItem[] = [
    {
        id: '1',
        title: 'Lakeside Cabin',
        author: 'John Doe',
        category: 'Home',
        rating: 4.8,
        reviews: 583,
        price: 249,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 1200,
        date: new Date('2023-01-15T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Lakeside+Cabin",
        description: "A cozy lakeside cabin perfect for a tranquil metaverse escape.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, OBJ' },
            { label: 'Polygons', value: '50,000' },
            { label: 'Vertices', value: '65,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '125 MB', downloadUrl: '#' },
            { format: 'OBJ', size: '110 MB', downloadUrl: '#' },
            { format: 'GLTF', size: '95 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Lakeside+Cabin+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Lakeside+Cabin+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Lakeside+Cabin+03"
        ]
    },
    {
        id: '2',
        title: 'Cyberpunk Alley',
        author: 'Jane Smith',
        category: 'Sci-Fi',
        rating: 4.9,
        reviews: 875,
        price: 499,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: true,
        likes: 1500,
        date: new Date('2023-02-20T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Cyberpunk+Alley",
        description: "A neon-soaked cyberpunk street scene with dynamic animations.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '150,000' },
            { label: 'Vertices', value: '180,000' },
            { label: 'Textures', value: '8K PBR' },
            { label: 'License', value: 'Extended Commercial' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '345 MB', downloadUrl: '#' },
            { format: 'GLB', size: '280 MB', downloadUrl: '#' },
            { format: 'UnityPackage', size: '410 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Cyberpunk+Alley+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Cyberpunk+Alley+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Cyberpunk+Alley+03"
        ]
    },
    {
        id: '3',
        title: 'Medieval Castle',
        author: 'Alice Johnson',
        category: 'Fantasy',
        rating: 4.7,
        reviews: 312,
        price: 349,
        isFavorite: false,
        isDownloadable: false,
        isAnimated: false,
        likes: 900,
        date: new Date('2023-03-10T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Medieval+Castle",
        description: "An intricate medieval castle with full interior and exterior details.",
        technicalInfo: [
            { label: 'File Format', value: 'OBJ, DAE' },
            { label: 'Polygons', value: '85,000' },
            { label: 'Vertices', value: '95,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'OBJ', size: '215 MB', downloadUrl: '#' },
            { format: 'DAE', size: '190 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Medieval+Castle+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Medieval+Castle+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Medieval+Castle+03"
        ]
    },
    {
        id: '4',
        title: 'Urban Office',
        author: 'Bob Williams',
        category: 'Office',
        rating: 4.5,
        reviews: 450,
        price: 199,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 750,
        date: new Date('2023-04-05T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Urban+Office",
        description: "A modern, open-plan office space with custom props.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '60,000' },
            { label: 'Vertices', value: '72,000' },
            { label: 'Textures', value: '2K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '98 MB', downloadUrl: '#' },
            { format: 'GLB', size: '75 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Urban+Office+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Urban+Office+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Urban+Office+03"
        ]
    },
    {
        id: '5',
        title: 'Industrial Warehouse',
        author: 'Charlie Brown',
        category: 'Warehouse',
        rating: 4.6,
        reviews: 210,
        price: 299,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 600,
        date: new Date('2023-05-12T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Industrial+Warehouse",
        description: "A large, detailed warehouse with industrial machinery and props.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, OBJ' },
            { label: 'Polygons', value: '110,000' },
            { label: 'Vertices', value: '135,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '205 MB', downloadUrl: '#' },
            { format: 'OBJ', size: '188 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Industrial+Warehouse+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Industrial+Warehouse+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Industrial+Warehouse+03"
        ]
    },
    {
        id: '6',
        title: 'Tropical Beach',
        author: 'Diana Prince',
        category: 'Nature',
        rating: 4.9,
        reviews: 1100,
        price: 599,
        isFavorite: true,
        isDownloadable: true,
        isAnimated: true,
        likes: 2100,
        date: new Date('2023-06-30T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Tropical+Beach",
        description: "A stunning tropical beach environment with realistic water and foliage.",
        technicalInfo: [
            { label: 'File Format', value: 'GLB' },
            { label: 'Polygons', value: '175,000' },
            { label: 'Vertices', value: '200,000' },
            { label: 'Textures', value: '8K PBR' },
            { label: 'License', value: 'Extended Commercial' }
        ],
        downloadFormats: [
            { format: 'GLB', size: '315 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Tropical+Beach+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Tropical+Beach+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Tropical+Beach+03"
        ]
    },
];

export const myListedTwinsJson: BaseItem[] = [
    {
        id: 'ml1',
        title: 'My First Home',
        author: 'You',
        category: 'Home',
        rating: 0,
        reviews: 0,
        price: 0,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 0,
        date: new Date('2023-09-01T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=My+First+Home",
        description: "A digital twin of my own home, ready for sharing.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '30,000' },
            { label: 'Vertices', value: '35,000' },
            { label: 'Textures', value: '2K PBR' },
            { label: 'License', value: 'Personal Use' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '60 MB', downloadUrl: '#' },
            { format: 'GLB', size: '52 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=My+First+Home+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=My+First+Home+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=My+First+Home+03"
        ]
    }
];

export const assetsJson: BaseItem[] = [
    {
        id: 'a1',
        title: 'Vintage Chair',
        author: 'Eve Davis',
        category: 'Props',
        rating: 4.7,
        reviews: 150,
        price: 25,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 400,
        date: new Date('2023-07-01T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Vintage+Chair",
        description: "A detailed 3D model of a vintage wooden chair.",
        technicalInfo: [
            { label: 'File Format', value: 'OBJ, GLB' },
            { label: 'Polygons', value: '2,500' },
            { label: 'Vertices', value: '3,000' },
            { label: 'Textures', value: '2K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'OBJ', size: '15 MB', downloadUrl: '#' },
            { format: 'GLB', size: '10 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Vintage+Chair+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Vintage+Chair+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Vintage+Chair+03"
        ]
    },
    {
        id: 'a2',
        title: 'Assault Rifle',
        author: 'Frank Miller',
        category: 'Weapons',
        rating: 4.9,
        reviews: 300,
        price: 75,
        isFavorite: true,
        isDownloadable: true,
        isAnimated: true,
        likes: 800,
        date: new Date('2023-08-01T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Assault+Rifle",
        description: "A highly detailed and animated 3D model of an assault rifle.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '15,000' },
            { label: 'Vertices', value: '18,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Extended Commercial' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '45 MB', downloadUrl: '#' },
            { format: 'GLB', size: '38 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Assault+Rifle+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Assault+Rifle+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Assault+Rifle+03"
        ]
    }
];