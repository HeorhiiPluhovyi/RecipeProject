import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from "../../../shared/recipe.module";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() id: number;

  ngOnInit(): void {
  }
}
