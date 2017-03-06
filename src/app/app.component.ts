import { Component, OnInit, ElementRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/from';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/mergeAll';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import '../../node_modules/chart.js/src/chart.js';
declare var Chart: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    title = 'app works!';
    private element: ElementRef;
    public pro: any;
    public data = {
        datasets: [{
            data: [300, 50],
            backgroundColor: [
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#36A2EB",
                "#FFCE56"
            ]
        }]
    };

    // private observer = {
    //     next: () => this.init(),
    //     error: () => console.log('Error'),
    //     complete: () => console.log('complete')
    // };

    // private myob = Observable.create((observer) => {
    //     observer.next('');
    // });
    private myob = Observable.of('1');
    private count = 0;

    // private myob1 = Observable.create((obv) => obv.next('clover'));

    // constructor () {
    //     this.oble.subscribe({
    //         next: (x) => this.init()
    //     });

    constructor(private el: ElementRef) {
      this.element = el;
    }
    ngOnInit() {
        // this.init();
        // this.day9();
        // this.day10();
        // this.day11();
        // this.day12();
        // this.clickEvent();
        // this.day16();
        // this.day17();
        // this.day18();
        // this.tryMergeAll();
    }

    init() {
        this.pro = new Chart(<HTMLCanvasElement>this.element.nativeElement.querySelector('#myChart'), {
            type: 'doughnut',
            data: this.data,
            options: {
                responsiveAnimationDuration: 1000,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                animation: {
                    duration: 2000,
                    easing: "easeOutBounce"
                },
                // onResize: (chart) => {
                //     this.myob.switchMap(() => Observable.of('2').delay(2000)).subscribe(
                //         (x) => { console.log(`------ hi: ${x} -----`); }
                //     );
                // }
            }
        });

        Chart.plugins.register({
            beforeDraw: (chart) => {
                if (chart.config.type === 'doughnut') {
                    let width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;

                    ctx.restore();
                    let fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";

                    let text = "75%",
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2;

                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            }
        });

        /* drag */
        const dragDom = document.getElementById('bg');
        const body = document.body;

        // 需要的event : mousedown, mousemove, mouseup

        // mousedown
        const mouseDown = Observable.fromEvent(dragDom, 'mousedown');

        // mousemove
        const mouseMove = Observable.fromEvent(body, 'mousemove');

        // mouseup
        const mouseUp = Observable.fromEvent(body, 'mouseup');

        mouseDown.map(event => mouseMove.takeUntil(mouseUp))
        .concatAll()
        .map(m => ({x: m['clientX'], y: m['clientY']}))
        .subscribe(
            pos => {
                dragDom.style.top = pos.y + 'px';
                dragDom.style.left = pos.x + 'px';
            }
        );

        let so = Observable.range(0, 3).map((x) => Observable.range(x, 3)).concatAll();
        so.subscribe(
            (x) => console.log(x)
        );
    }

    day9() {
        // '------ skip -----'
        let source = Observable.interval(1000);
        let example = source.skip(3);

        example.subscribe(
            (value) => console.log(value),
            (err) => console.log(err),
            () => console.log('complete')
        );

        // '------ takeLast -----'
        // 會在observable 完成之後一次送出4,5 complete
        let source1 = Observable.interval(1000).take(6);
        let example1 = source.takeLast(2);
        example1.subscribe(
          (value) => console.log(value),
          (err) => console.log(err),
          () => console.log('complete')
        );

        // '----- last -----'
        let source2 = Observable.interval(1000).take(6);
        let example2 = source2.last();
        example2.subscribe(
          (value) => console.log(`--- last --- : ${value}`),
          (err) => console.log(err),
          () => console.log('--- last --- complete')
        );

        // '------- concat ---------'
        // 須第一個observable 結束後才會繼續下一個
        let source3 = Observable.interval(1000).take(3);
        let source3_1 = Observable.of(3);
        let source3_2 = Observable.of(4, 5, 6);
        let example3 = source3.concat(source3_1, source3_2);
        example3.subscribe(
          (value) => console.log(`--- concat --- : ${value}`),
          (err) => console.log(err),
          () => console.log('--- concat --- complete')
        );

        // '------ startWith -----'
        // startWith 的值是一開始就同步發出的，這個 operator 很常被用來保存程式的起始狀態！
        let source4 = Observable.of(3, 4, 5);
        let example4 = source4.startWith(0);
        example4.subscribe(
          (value) => console.log(`--- startWith --- : ${value}`),
          (err) => console.log(err),
          () => console.log('--- startWith --- complete')
        );

        // '------ merge ------'
        // merge 把多個 observable 同時處理，這跟 concat 一次處理一個 observable 是完全不一樣的
        // 當兩件事情同時發生時，會同步送出資料(被 merge 的在後面)，當兩個 observable 都結束時才會真的結束。
        let source5 = Observable.interval(500).take(3);
        let source5_1 = Observable.interval(300).take(6);
        let example5 = source5.merge(source5_1);
        example5.subscribe(
          (value) => console.log(`--- merge --- : ${value}`),
          (err) => console.log(err),
          () => console.log('--- merge --- complete')
        );
    }

    day10() {
      // '----- combineLatest ----'
      let source1 = Observable.interval(500).take(3);
      let newest1 = Observable.interval(1000).take(5);
      let example1 = source1.combineLatest(newest1, (x, y) => x + y);
      example1.subscribe(
        (value) => console.log(`---- combineLatest: ${value} ----`),
        (err) => console.log(err),
        () => console.log('---- combineLatest complete ----')
      );

      // '------- zip -------'
      // 建議大家平常沒事不要亂用 zip，除非真的需要。因為 zip
      // 必須 cache 住還沒處理的元素，當我們兩個 observable
      // 一個很快一個很慢時，就會 cache 非常多的元素，等待
      // 比較慢的那個 observable。這很有可能造成記憶體相關的問題！
      let source2 = Observable.interval(1000).take(3);
      let newest2 = Observable.interval(500).take(6);
      let example2 = source2.zip(newest2, (x, y) => x + y);
      example2.subscribe(
        (value) => console.log(`---- zip: ${value} ----`),
        (err) => console.log(err),
        () => console.log('---- zip complete ----')
      );

      let a = Observable.from('Clover');
      let b = Observable.interval(1000);
      let examplea = a.zip(b, (x, y) => console.log(x));
      examplea.subscribe(
        (value) => console.log(`---- zip show char: ${value} ----`),
        (err) => console.log(err),
        () => console.log('---- zip show char complete ----')
      );

      // '----- withLatestFrom -----'
      let source3 = Observable.from('cloverhsc').zip(Observable.interval(500), (x, y) => x);
      let some = Observable.from([0, 1, 0, 0, 0, 1]).zip(Observable.interval(300), (x, y) => x);
      let example3 = source3.withLatestFrom(some, (x, y) => {
        return y === 1 ? x.toUpperCase() : x;
      });

      example3.subscribe(
        (value) => console.log(`---- withLatestFrom: ${value} ----`),
        (err) => console.log(err),
        () => console.log('---- withLatestFrom complete ----')
      );

    }

    day11() {
      const video = document.getElementById('video');
      const anchor = document.getElementById('anchor');
      const scroll = Observable.fromEvent(document, 'scroll');

      scroll.map(e => anchor.getBoundingClientRect().bottom < 0)
      .subscribe(
        bool => {
          if (bool) {
            video.classList.add('video-fixed');
          } else {
            video.classList.remove('video-fixed');
          }
        }
      );

      const mouseDown = Observable.fromEvent(video, 'mousedown');
      const mouseUp = Observable.fromEvent(document, 'mouseup');
      const mouseMove = Observable.fromEvent(document, 'mousemove');

      const validValue = (value, max, min) => {
        return Math.min(Math.max(value, min), max);
      };

      mouseDown.filter( e => video.classList.contains('video-fixed'))
      .map(e => mouseMove.takeUntil(mouseUp)).concatAll()
      .withLatestFrom(mouseDown, (move, down) => {
        return {
            x: validValue(move['clientX'] - down['offsetX'], window.innerWidth - 320, 0),
            y: validValue(move['clientY'] - down['offsetY'], window.innerHeight - 180, 0)
          };
      })
      .subscribe(
        pos => {
          video.style.top = pos.y + 'px';
          video.style.left = pos.x + 'px';
        }
      );
    }

    day12() {
      let source = Observable.interval(300);
      let source2 = Observable.interval(1000);
      let example = source.buffer(source2);

      example.subscribe(
        (value) => console.log(value),
        (err) => console.log(err),
        () => console.log('success')
      );
    }

    clickEvent() {
      const button = document.getElementById('demo');
      const ck = Observable.fromEvent(button, 'click');
      const example = ck.bufferTime(500).filter( evt => {
        console.log(evt);
        console.log(`--- length: ${evt['length']}`);
        return true;
      })

      example.subscribe(
        (x) => console.log('success'),
        (err) => console.log(err),
        () => console.log('success')
      );
    }

    day16() {
      let source1 = Observable.from([{value: 'a'}, {value: 'b'},
      {value: 'c'}, {value: 'a'}, {value: 'b'}])
                    .zip(Observable.interval(300), (x, y) => x );
      let example1 = source1.distinct((x) => x.value);
      example1.subscribe(
        (value) => console.log(value),
        (err) => console.log(err),
        () => console.log('success')
      );
    }

    day17() {
      // let source = Observable.from(['a', 'b', 'c', 'd', 2])
      //             .zip(Observable.interval(500), (x, y) => x);
      // let example = source.map((x) => x.toUpperCase())
      //               .catch(error => Observable.of('h'));
    }

    day18() {
      let click = Observable.fromEvent(document.body, 'click');
      let source = click.map(e => Observable.interval(1000));

      let example = source.switch();
      example.subscribe(
        (value) => console.log(value),
        (err) => console.log(err),
        () => console.log('success')
      );
    }

    tryMergeAll() {
      let click = Observable.fromEvent(document.body, 'click');
      let source = click.map(e => Observable.interval(1000));
      let example = source.mergeAll();

      example.subscribe(
        (value) => console.log(value),
        (err) => console.log(err),
        () => console.log('success')
      );
    }
}
