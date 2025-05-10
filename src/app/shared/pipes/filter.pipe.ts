import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[] | null, searchText: string): any[] {
    if (!items || !searchText) {
      return items || [];
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Buscar en todas las propiedades de string del item
      return Object.keys(item).some(key => {
        const value = item[key];
        return typeof value === 'string' && value.toLowerCase().includes(searchText);
      });
    });
  }

}
