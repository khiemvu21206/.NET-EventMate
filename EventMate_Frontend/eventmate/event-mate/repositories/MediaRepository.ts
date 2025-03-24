import createRepository from '@/ultilities/createRepository';  

export type MultimediaDto = {
    imageId: string;
    url: string;
    createdAt: Date;
    createdBy: string;
    creatorName: string;
    type: number;
    status: number;
}

export type AlbumDto = {
    albumId: string;
    name: string;
    description?: string;
    createdAt: Date;
    createdBy?: string;
    creatorName?: string;
    groupId?: string;
    userId?: string;
    groupName?: string;
    multimedia: MultimediaDto[];
}

export type FavoriteMediaDTO = {
    MultimediaId: string;
    UserId: string;
}

export const MediaRepository = createRepository({
    getAlbumsByGroup: async (fetch, groupId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/group/${groupId}/albums`, {
            method: "GET",
        });
        return response;
    },
    createAlbum: async (fetch, albumData: AlbumDto) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/album`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: albumData,
        });
        return response;
    },
    getAlbumsByUser: async (fetch, userId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/user/${userId}/albums`, {
            method: "GET",
        });
        return response;
    },
    addFavoriteMedia: async (fetch, favoriteMediaData: FavoriteMediaDTO) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/favorite`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: favoriteMediaData,
        });
        return response;
    },
    countFavoriteMedia: async (fetch, mediaId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/favorite/count/${mediaId}`, {
            method: "GET",
        });
        return response;
    },
    checkFavoriteMedia: async (fetch, userId: string, multimediaId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/favorite/check?userId=${userId}&multimediaId=${multimediaId}`, {
            method: "GET",
        });
        return response;
    },
    removeFavoriteMedia: async (fetch, userId: string, multimediaId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/favorite?userId=${userId}&multimediaId=${multimediaId}`, {
            method: "DELETE",
        });
        return response;
    },
    removeMultimedia: async (fetch, multimediaId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Media/${multimediaId}`, {
            method: "DELETE",
        });
        return response;
    },
});
