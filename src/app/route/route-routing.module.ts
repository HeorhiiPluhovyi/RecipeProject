import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { RecipesComponent } from '../recipes/recipes.component';
import { RecipeStartComponent } from '../recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from '../recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from '../recipes/recipe-edit/recipe-edit.component';
import { ShoppingListEditComponent } from '../shopping-list/shopping-list-edit/shopping-list-edit.component';
import { RecipesResolverService } from '../services/recipes-resolver.service';
import { AuthComponent } from '../auth/auth.component';
import { AuthGuardServiceService } from '../auth/auth-guard-service.service';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuardServiceService],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
      { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
    ]
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
    children: [
      { path: ':id/edit', component: ShoppingListEditComponent }
    ]
  },
  { path: 'auth', component: AuthComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
