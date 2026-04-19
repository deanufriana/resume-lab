import { createRouter, createWebHashHistory } from 'vue-router'
import { 
  ResumeForm, 
  ResumePreview, 
  SignaturePad, 
  About 
} from '../components'
import UploadView from '../views/UploadView.vue'

const routes = [
  {
    path: '/',
    redirect: '/upload'
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView
  },
  {
    path: '/manual',
    name: 'manual',
    component: ResumeForm
  },
  {
    path: '/preview',
    redirect: '/manual'
  },
  {
    path: '/signature',
    name: 'signature',
    component: SignaturePad
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
