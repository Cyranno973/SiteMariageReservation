import {animate, group, query, style, transition, trigger,} from '@angular/animations';

export const routeAnimations =
  trigger('routeAnimations', [
    transition('home => activity', slideTo('right')),
    transition('home => info', slideTo('right')),
    transition('home => admin', slideTo('right')),
    transition('activity => home', slideTo('left')),
    transition('activity => info', slideTo('right')),
    transition('activity => admin', slideTo('right')),
    transition('info => home', slideTo('left')),
    transition('info => activity', slideTo('left')),
    transition('info => admin', slideTo('right')),
    transition('admin => home', slideTo('left')),
    transition('admin => activity', slideTo('left')),
    transition('admin => info', slideTo('left')),
  ]);

function slideTo(direction: string) {
  const optional = {optional: true};

  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({
        [direction]: '100%',
        opacity: 0,
      })
    ], optional),
    group([
      query(':leave', [
        animate('600ms ease', style({
          [direction]: '-100%',
          opacity: 0
        }))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({
          [direction]: '0%',
          opacity: 1
        }))
      ], optional)
    ])
  ];
}
