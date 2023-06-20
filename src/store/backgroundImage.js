import { defineStore } from 'pinia'

export const useImageStore = defineStore({
    id: 'image',
    state: () => ({
        currentImage: JSON.parse(sessionStorage.getItem('background-image')) || {}
    }),
    // getters: {
    //     getCurrentImage: (state) => {
    //         return state.currentImage
    //     }
    // },
    actions: {
        setCurrentImage(image) {
            this.currentImage = image;
            const imageJson = JSON.stringify(image);
            sessionStorage.setItem('background-image', imageJson);
        },
    },
})