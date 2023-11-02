import {
    createRouter,
    createWebHistory
} from 'vue-router'
import { isAuthenticated } from "@/mixin/AuthToken";
import ContextView from '@/views/ContextView.vue'
import ChatView from '@/views/ChatView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import GalleryView from '@/views/GalleryView.vue'
import LandingView from '@/views/LandingView.vue'

const routes = [{
        path: '/context',
        name: 'Context',
        component: ContextView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/conversation',
        name: 'Conversation',
        component: ChatView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: GalleryView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/',
        name: 'Landing',
        component: LandingView
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/'); 
    } else {
        next();
    }
});

export default router