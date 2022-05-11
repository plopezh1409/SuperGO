import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { TimeLineService } from '@app/core/services/binnacle/time-line.service';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.sass']
})
export class TimeLineComponent implements OnInit, OnChanges {

  @Input() response: any;

  constructor(public timeLineService: TimeLineService ) {
  }

  ngOnInit(): void {  
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

}
