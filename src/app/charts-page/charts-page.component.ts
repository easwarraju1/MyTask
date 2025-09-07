import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { Chart, ChartTypeRegistry } from "chart.js";
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxMarqueeModule } from 'ngx-marquee';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-charts-page',
  imports: [ButtonModule, TableModule, InputTextModule, CommonModule, FormsModule, ChartModule, CardModule, PopoverModule, SliderModule, MultiSelectModule, DialogModule, ColorPickerModule,
    RadioButtonModule, NgxMarqueeModule,ToggleSwitchModule,ToastModule,InputNumberModule,CheckboxModule
  ],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.scss',
  providers: [MessageService]
})
export class ChartsPageComponent {
  // first page variables
  chart: any;
  table_headers: any = [];
  table_data: any = [];
  isDarkMode = false;
  primeng_charts_data: any;
  opted_charts: any = []
  charts_list: any = [
    { label: 'Bar', value: 'bar', index_axis: 'x' },
    { label: 'Stacked Bar', value: 'stacked_bar', index_axis: 'x' },
    { label: 'Line', value: 'line', index_axis: 'x' },
    { label: 'Radar', value: 'radar', index_axis: 'x' },
    // { label: 'Pie', value: 'pie' },
    // { label: 'Doughnut', value: 'doughnut' }
    // { label: 'Bubble', value: 'bubble' },
    // { label: 'Scatter', value: 'scatter' }
  ]
  show_global_settings: boolean = false;
  index_options: any = [
    { label: 'X', value: 'x' },
    { label: 'Y', value: 'y' }
  ];
  is_fill:boolean = false
  selected_individual_chart: any;
  opted_charts_list: any = [];
  first_page: boolean = true;
  duplicate_table_data: any = [];
  constructor(private messageService: MessageService) { }
  brightness: any = [40, 120]
  defalt_color: any = '#dadced';
  selected_records:any = []
  show_conform_dialog:boolean = false
  is_heatmap:boolean = false

  //second page variables
  compareData_options: any = [
    { label: 'By Brand', value: 'brand' },
    { label: 'By Country', value: 'Country' },
  ]
  opted_option: any = this.compareData_options[0];
  brands_list: any = [
    { label: 'Benepali' },
    { label: 'Enbrel' },
    { label: 'Erelzi' },
  ]
  countries_list :any = [
    { label: 'France' },
    { label: 'Germany' },
    { label: 'Italy' },
    { label: 'Spain'}
  ]

  selected_options: any = [this.brands_list[0]];
  exper_charts_data: any = [];
  
  second_table_headers: any = [];
  second_table_data: any = [];

  title = 'hackathon_prototype';
  ngOnInit() {
    this.brightness = 100
    this.opted_charts = [this.charts_list[0]];
    this.opted_charts_list = this.opted_charts.map((x: any) => x.value);
    // console.log(this.opted_charts, this.opted_charts_list)
    setTimeout(() => {
      this.construct_charts_data();
      this.construct_chartsJS_charts_data('bar');
    }, 500);

    this.table_headers = [
      { label: 'Year', value: 'label' },
      { label: 'Drug 1', value: 'jan' },
      { label: 'Drug 2', value: 'feb' },
      { label: 'Drug 3', value: 'mar' },
      { label: 'Drug 4', value: 'apr' },
      { label: 'Drug 5', value: 'may' },
      { label: 'Drug 6', value: 'jun' },
      { label: 'Drug 7', value: 'jul' },
    ];
    if(sessionStorage.getItem('tab_data')) {
      const data:any = sessionStorage.getItem('tab_data')
      const existing_data = JSON.parse(data)
      this.table_data = existing_data
    } else {
      this.table_data = [
        {
          ds: 1,
          jan: '65',
          feb: '59',
          mar: '80',
          apr: '81',
          may: '56',
          jun: '55',
          jul: '40',
          bg_color: 'cyan',//'var(--p-cyan-100)',
          border_color: 'cyan',//'var(--p-cyan-100)',
          border_radius: 5,
          label: '2000',
          chartjs_bg_color: 'green',
          chartjs_border_color: 'green',
          fill:false,
          tension: 0.4,
        },
        {
          ds: 2,
          jan: '28',
          feb: '48',
          mar: '40',
          apr: '19',
          may: '86',
          jun: '27',
          jul: '90',
          bg_color: 'orange',//'var(--p-orange-100)',
          border_color: 'orange',//'var(--p-orange-100)',
          border_radius: 10,
          label: '2001',
          chartjs_bg_color: 'yellow',
          chartjs_border_color: 'yellow',
        }
      ];
    }
    console.log(this.table_data)
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeClass = this.isDarkMode ? 'theme-dark' : 'theme-light';
    document.body.className = themeClass;
  }

  construct_charts_data(chart_type?: any) {
    console.log('constructing chart data...', this.table_headers, this.table_data);
    const labels = this.table_headers.slice(1).map((header: any) => header?.label);
    const datasets = this.table_data.map((product: any) => ({
      label: product.label,
      backgroundColor: product?.fill === true ? 'rgba(107, 114, 128, 0.2)' : product?.bg_color,//getComputedStyle(document.documentElement).getPropertyValue('var(--p-cyan-100)'),
      borderColor: product.border_color,//getComputedStyle(document.documentElement).getPropertyValue(product.border_color),
      data: this.table_headers.slice(1).map((header: any) => product[header.value]),
      borderWidth: product?.border_width,//1,
      borderRadius: product?.border_radius, //5,
      fill: product?.fill,
      // borderDash: [10, 10], 
      tension: 0.1,
    }));
    this.primeng_charts_data = {
      labels: labels,
      datasets: datasets
    };
    console.log(this.primeng_charts_data);
  }

  construct_chartsJS_charts_data(data?: any) {
    console.log(data,this.opted_charts)
    // let type: keyof ChartTypeRegistry = data == 2 ? 'line' : data == 3 ? 'radar' : 'bar';
    const datasets = this.table_data.map((product: any) => ({
      label: product.label,
      backgroundColor: product.chartjs_bg_color,
      borderColor: product.chartjs_border_color,
      data: this.table_headers.slice(1).map((header: any) => product[header.value]),
      borderWidth: 1,
      borderRadius: product?.border_radius//5,
    }));
    if(!data) {
      console.log('jkhdjhdjhjhj')
    }
    if (data) {
      console.log(data)
      // console.log('afjshfhj',this.opted_charts[data].value)
      this.chart = new Chart(`${data}`, {
        // type: `${type}`,
        // type: this.opted_charts[data].value == 'stacked_bar' ? 'bar' :this.opted_charts[data].value ,
        type:data == 'stacked_bar' ? 'bar' : data,
        data: {
          labels: this.table_headers.slice(1).map((header: any) => header?.label),
          datasets: datasets
        },
        options: {
          // plugins: {
          //   title: {
          //     display: true,
          //     text: 'Chart.js Bar Chart - Stacked'
          //   },
          // },
          responsive: true,
          scales: {
            x: {
              // stacked: this.opted_charts[data].value == 'stacked_bar' ? true : false,
              stacked: data == 'stacked_bar' ? true : false,
            },
            y: {
              stacked: data == 'stacked_bar' ? true : false,
            }
          }
        }
      });
      console.log(this.chart)
    }
  }

  someFunction(fun?: any, row_data?: any) {
    console.log('function called...', fun, row_data);
    console.log(this.table_data)
    sessionStorage.setItem('tab_data',JSON.stringify(this.table_data))
    this.construct_charts_data();
    // for (let i = 1; i <= this.table_data?.length; i++) {
    //   const chartInstance = Chart.getChart(`canvas${i}`);
    //   if (chartInstance) {
    //     chartInstance.destroy();
    //   }
    //   setTimeout(() => {
    //     this.construct_chartsJS_charts_data(i)
    //   }, 10);
    // }
    if (this.opted_charts && this.opted_charts.length > 0) {
      for (let i = 1; i <= this.opted_charts.length; i++) {
        const chartInstance = Chart.getChart(`${this.opted_charts[i-1]?.value}`);
        if (chartInstance) {
          chartInstance.destroy();
        }
        console.log(this.opted_charts[i-1]?.value)
        setTimeout(() => {
          console.log(this.opted_charts[i-1]?.value)
          this.construct_chartsJS_charts_data(this.opted_charts[i-1]?.value)
        }, 10);
      }
    }
  }
  on_select_icon(from?: any) {
    this.brightness = 100
  }

  add_new(from?: any) {
    console.log('adding new...', from);
    switch (from) {
      case 'column':
        this.table_headers = [...this.table_headers, { label: '', value: '' }]
        break;
      case 'row':
        this.table_data = [...this.table_data, {
          ds: Math.random() * 100,
          jan: '',
          feb: '',
          mar: '',
          apr: '',
          may: '',
          jun: '',
          jul: '',
          // bg_color: 'var(--p-cyan-100)',
          // border_color: 'var(--p-cyan-100)',
          label: '',
          chartjs_bg_color: '',
          chartjs_border_color: '',
        }]
        break;
      case 'del' :
        this.duplicate_table_data = this.table_data
        this.show_conform_dialog = true
        break;  
      default:
        break;
    }
    console.log(this.table_headers, this.table_data);
  }

  on_change_values(evnt?: any) {
    console.log(evnt, this.opted_charts);
    this.opted_charts_list = this.opted_charts.map((x: any) => x.value);
    console.log(this.opted_charts_list)
    this.construct_charts_data();
    if (this.opted_charts && this.opted_charts.length > 0) {
      for (let i = 1; i <= this.opted_charts.length; i++) {
        const chartInstance = Chart.getChart(`${this.opted_charts[i-1]?.value}`);
        if (chartInstance) {
          chartInstance.destroy();
        }
        console.log(this.opted_charts[i-1]?.value)
        setTimeout(() => {
          console.log(this.opted_charts[i-1]?.value)
          this.construct_chartsJS_charts_data(this.opted_charts[i-1]?.value)
          // this.construct_charts_data(this.opted_charts[i-1]);
        }, 10);
      }
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color)
    return color;
  }

  global_settings_dialog(from?: any) {
    if (from == 'primeng_main') {
      this.show_global_settings = true;
    }
    console.log('checking table data', this.table_data)
  }

  update_global_settings(evnt?: any, chart?: any, from?: any) {
    console.log(evnt, chart, from);
    if (chart == 'screen') {
      document.body.style.backgroundColor = evnt?.value;
    } else {
      console.log('shjfbshvfh', evnt, chart)
      // if (from == 'border_width') {
      //   chart.border_width = evnt?.value
      // } else {
      //   chart.bg_color = evnt?.value
      //   chart.border_color = evnt?.value
      // }

        chart.bg_color = evnt?.value
        chart.border_color = evnt?.value

      this.table_data = [...this.table_data]
      this.construct_charts_data();
    }
  }

  update_indiv_settings(evnt?: any, data?: any, from?:any) {
    console.log(evnt, data)
    if(from == 'border_radius') {
      data.border_radius = evnt?.value
    }  else if(from == 'fill') {
      data.fill = evnt?.checked
    }else {
      data.border_width = evnt?.value
    }
    this.table_data = [...this.table_data]
    this.construct_charts_data();
  }

  chart_settings(chart?: any) {
    console.log('chart settings clicked...', chart)
    this.selected_individual_chart = chart;
  }
  opted_index: any = this.index_options[0];
  change_index_axis(evnt?: any) {
    console.log(evnt, this.selected_individual_chart, this.charts_list, this.opted_charts, this.opted_index)
    this.opted_charts = this.opted_charts?.filter((x: any) => x.label == this.selected_individual_chart.label ? (x.index_axis = this.opted_index?.value) : x)
    console.log(this.opted_charts)
    this.construct_charts_data();
  }

  on_click(from?: any) {
    console.log(from)
    if (from == 'back') {
      this.first_page = true
      setTimeout(() => {
        this.construct_charts_data();
        this.construct_chartsJS_charts_data('bar');
      }, 500);
    } else {
      this.first_page = false
      this.generate_comparasion_charts(this.selected_options[0])
    }
  }

  generate_comparasion_charts(opted?:any,index?:any) {
    console.log('hittoing her',opted,index,this.opted_option)
    this.second_table_headers = [
      { label: '2000', value: '2000' },
      { label: '2001', value: '2001' },
      { label: '2002', value: '2002' },
      { label: '2003', value: '2003' },
      { label: '2004', value: '2004' },
    ];
    this.second_table_data = [
      {
        countries_data : [{
          ds: '1',
          2000: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '14' : '2',
          2001: opted?.label == 'Enbrel' ? '5' : opted?.label == 'Benepali' ? '13' : '59',
          2002: opted?.label == 'Enbrel' ? '4' : opted?.label == 'Benepali' ? '12' : '80',
          2003: opted?.label == 'Enbrel' ? '3' : opted?.label == 'Benepali' ? '11' : '81',
          2004: opted?.label == 'Enbrel' ? '2' : opted?.label == 'Benepali' ? '10' : '56',
          bg_color: 'orange',//'var(--p-cyan-100)',
          border_color: 'orange',//'var(--p-cyan-100)',
          border_radius: 5,
          label: 'France',
        },
        {
          ds: '2',
          2000: opted?.label == 'Enbrel' ? '3' : opted?.label == 'Benepali' ? '58' : '28',
          2001: opted?.label == 'Enbrel' ? '2' : opted?.label == 'Benepali' ? '24' : '48',
          2002: opted?.label == 'Enbrel' ? '4' : opted?.label == 'Benepali' ? '14' : '40',
          2003: opted?.label == 'Enbrel' ? '6' : opted?.label == 'Benepali' ? '34' : '19',
          2004: opted?.label == 'Enbrel' ? '5' : opted?.label == 'Benepali' ? '44' : '86',
          bg_color: 'blue',//'var(--p-orange-100)',
          border_color: 'blue',//'var(--p-orange-100)',
          border_radius: 10,
          label: 'Germany',
        },
        {
          ds: '2',
          2000: opted?.label == 'Enbrel' ? '75' : opted?.label == 'Benepali' ? '5' : '81',
          2001: opted?.label == 'Enbrel' ? '52' : opted?.label == 'Benepali' ? '4' : '47',
          2002: opted?.label == 'Enbrel' ? '89' : opted?.label == 'Benepali' ? '2' : '55',
          2003: opted?.label == 'Enbrel' ? '74' : opted?.label == 'Benepali' ? '3' : '36',
          2004: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '47',
          bg_color: 'green',//'var(--p-orange-100)',
          border_color: 'green',//'var(--p-orange-100)',
          border_radius: 10,
          label: 'Italy',
        },
        {
          ds: '2',
          2000: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '77',
          2001: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '65',
          2002: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '4',
          2003: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '85',
          2004: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '12',
          bg_color: 'yellow',//'var(--p-orange-100)',
          border_color: 'yellow',//'var(--p-orange-100)',
          border_radius: 10,
          label: 'Spain',
        }],
        brands_data:[
          {
            ds: '1',
            2000: opted?.label == 'France' ? '65' : opted?.label == 'Germany' ? '14' : opted?.label == 'Italy' ? '45' : '2',
            2001: opted?.label == 'France' ? '5' : opted?.label == 'Germany' ? '13' : opted?.label == 'Italy' ? '41' : '59',
            2002: opted?.label == 'France' ? '4' : opted?.label == 'Germany' ? '12' : opted?.label == 'Italy' ? '77' : '80',
            2003: opted?.label == 'France' ? '3' : opted?.label == 'Germany' ? '11' : opted?.label == 'Italy' ? '36' : '81',
            2004: opted?.label == 'France' ? '2' : opted?.label == 'Germany' ? '10' : opted?.label == 'Italy' ? '47' : '56',
            bg_color: 'orange',//'var(--p-cyan-100)',
            border_color: 'orange',//'var(--p-cyan-100)',
            border_radius: 5,
            label: 'Benelapi',
          },
          {
            ds: '2',
            2000: opted?.label == 'France' ? '3' : opted?.label == 'Germany' ? '58' : opted?.label == 'Italy' ? '65' : '28',
            2001: opted?.label == 'France' ? '2' : opted?.label == 'Germany' ? '24' : opted?.label == 'Italy' ? '47' : '48',
            2002: opted?.label == 'France' ? '4' : opted?.label == 'Germany' ? '14' : opted?.label == 'Italy' ? '69' : '40',
            2003: opted?.label == 'France' ? '6' : opted?.label == 'Germany' ? '34' : opted?.label == 'Italy' ? '77' : '19',
            2004: opted?.label == 'France' ? '5' : opted?.label == 'Germany' ? '44' : opted?.label == 'Italy' ? '89' : '86',
            bg_color: 'blue',//'var(--p-orange-100)',
            border_color: 'blue',//'var(--p-orange-100)',
            border_radius: 10,
            label: 'Enbrel',
          },
          {
            ds: '2',
            2000: opted?.label == 'France' ? '4' : opted?.label == 'Germany' ? '5' : opted?.label == 'Italy' ? '22' : '81',
            2001: opted?.label == 'France' ? '2' : opted?.label == 'Germany' ? '4' : opted?.label == 'Italy' ? '56' : '47',
            2002: opted?.label == 'France' ? '89' : opted?.label == 'Germany' ? '2' : opted?.label == 'Italy' ? '74' : '55',
            2003: opted?.label == 'France' ? '74' : opted?.label == 'Germany' ? '3' : opted?.label == 'Italy' ? '69' : '36',
            2004: opted?.label == 'France' ? '65' : opted?.label == 'Germany' ? '1' : opted?.label == 'Italy' ? '63' : '47',
            bg_color: 'green',//'var(--p-orange-100)',
            border_color: 'green',//'var(--p-orange-100)',
            border_radius: 10,
            label: 'Erelzi',
          }
        ]
      }
    ];
    console.log(this.second_table_data, this.second_table_headers)
    let data_to_loop = this.opted_option?.label == 'By Country' ? this.second_table_data[0]?.brands_data : this.second_table_data[0]?.countries_data
    const labels = this.second_table_headers.map((header: any) => header?.label);
    const datasets = data_to_loop.map((product: any) => ({
      label: product.label,
      backgroundColor: product?.bg_color,//getComputedStyle(document.documentElement).getPropertyValue('var(--p-cyan-100)'),
      borderColor: product.border_color,//getComputedStyle(document.documentElement).getPropertyValue(product.border_color),
      data: this.second_table_headers.map((header: any) => product[header.value]),
      borderWidth: product?.border_width,//1,
      borderRadius: product?.border_radius, //5,
      fill: false,
      // borderDash: [5, 5],
      // tension: 0.1,

    }));
    if(opted?.label) {
      const obj:any = {
        brand:opted?.label,
        data_bind : {labels: labels,
          datasets: datasets}
      }
      this.exper_charts_data?.push(obj);
      this.exper_charts_data = [...new Set(this.exper_charts_data)]
      console.log([...new Set(this.exper_charts_data)]); //exper_charts_data
    }
  }

  on_change_brandss(evnt?: any) {
    console.log(evnt)
    this.exper_charts_data = []
    evnt?.value.forEach((element:any, i:any) => {
      this.generate_comparasion_charts(element,i)
    });
  }

  on_click_radio_button(evnt?:any) {
    console.log(evnt, this.opted_option )
    this.exper_charts_data = []
    if(this.opted_option?.label == 'By Country') {
      this.selected_options = [this.countries_list[0]];
      console.log(this.selected_options)
    } else {
      this.selected_options = [this.brands_list[0]];
    }
    this.generate_comparasion_charts(this.selected_options[0])

  }

  confirm_del(evnt?:any) {
    console.log('sscscscs',evnt,this.table_data,this.selected_records)
    console.log(this.selected_records?.map((x:any)=>x.ds))
    if(evnt == 'delete') {  
      // const updatedArray = this.table_data.filter((obj:any) => !this.selected_records?.map((x:any)=>x.ds).includes(obj.ds));
      this.table_data = this.table_data.filter((obj:any) => !this.selected_records?.map((x:any)=>x.ds).includes(obj.ds));
      console.log(this.table_data)
      this.show_conform_dialog = false
      this.selected_records = []
    } else {
      this.selected_records = []
      this.show_conform_dialog = false
    }
    sessionStorage.setItem('tab_data',JSON.stringify(this.table_data))
    this.on_change_values()
    // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });

  }

  on_sel_heatmap_option(evnt?:any) {
    console.log(this.is_heatmap, evnt)
  }
}
