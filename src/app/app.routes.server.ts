import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'product-details/:id', renderMode: RenderMode.Client },
  { path: 'category-filter/:id', renderMode: RenderMode.Client },
  { path: 'brands-filter/:id', renderMode: RenderMode.Client },
  {
    path: 'allorders',
    renderMode: RenderMode.Client   // SSR
  },
  {
    path: 'cart',
    renderMode: RenderMode.Client
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Client
  },
  {
    path: 'wishlist',
    renderMode: RenderMode.Client
  },

  {
    path: '**',
    renderMode: RenderMode.Server
  },];
