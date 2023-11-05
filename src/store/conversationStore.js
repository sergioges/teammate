import { defineStore } from 'pinia'

export const useConversationStore = defineStore({
    id: 'conversation',
    state: () => ({
        currentConversation: [],
    }),
    actions: {
        setCurrentConversation(conversation) {
            this.currentConversation.push(conversation);
        },
    },
})