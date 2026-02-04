import { AfterViewInit, Component, inject, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IReporteTurno } from '@oil-store/model';
import { TurnoService } from '@oil-store/service';
import { colorUtil } from '@utils/color.util';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-reporte.component',
  imports: [FormsModule],
  templateUrl: './reporte.component.html',
})
export class ReporteComponent implements AfterViewInit, OnChanges {
  _turnoService = inject(TurnoService);
  lookReport = signal(false);
  listYear = this.obtenerUltimosTresAnios();
  isDataStatistic = {
    id: 'register',
    labels: ['Ayacucho'],
    datasets: [
      {
        label: 'Venta anual',
        data: [12000],
      },
    ],
    info: {
      title: 'Venta anual',
      description: 'Total de venta anual',
      cant: 0,
    },
  };
  itemsPerPage = 'bar';
  itemsPerYear = 2025;

  chart: any;
  config: any;

  ngAfterViewInit() {
    // Inicializar el chart cuando el DOM esté listo
    if (this.isDataStatistic) {
      this.onItemsPerPageChange(this.itemsPerPage);
      this.reporteAnual(this.listYear[0]);
    }
  }

  reporteAnual(year: number = this.listYear[0]) {
    const y = Number(year);
    this.itemsPerYear = y;
    this._turnoService.getReporte(y).subscribe({
      next: (resp: IReporteTurno) => {
        if (resp.code === 200) {
          // Esperar al siguiente tick para que el DOM renderice el canvas, luego crear el chart
          setTimeout(() => this.onItemsPerPageChange(this.itemsPerPage), 0);
        }
        this.isDataStatistic.labels = resp.meses;
        this.isDataStatistic.datasets[0].data = resp.valores;
        this.isDataStatistic.info.cant = resp.valores.reduce(
          (acumulador, valorActual) => acumulador + valorActual,
          0,
        );
        this.lookReport.set(true);
      },
      error: (error: any) => {
        this.lookReport.set(true);
        console.log(error);
      },
    });
  }

  // Función para construir datasets dinámicamente
  buildDatasets() {
    const defaultColors = colorUtil;
    return this.isDataStatistic.datasets.map((ds: any, i: number) => {
      const color = defaultColors[i % defaultColors.length];
      return {
        label: ds.label,
        data: ds.data,
        backgroundColor:
          ds.backgroundColor ||
          (this.itemsPerPage === 'bar'
            ? color.backgroundColor.replace('rgb', 'rgba').replace(')', ', 0.8)')
            : color.backgroundColor),
        borderColor: ds.borderColor || color.borderColor,
        borderWidth: 2,
        tension: 0.4, // Para gráficos de línea
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDataStatistic'] && this.isDataStatistic) {
      // Usar setTimeout para asegurar que el DOM esté actualizado
      setTimeout(() => {
        this.onItemsPerPageChange(this.itemsPerPage);
      }, 0);
    }
  }

  onItemsPerPageChange(value: any) {
    this.itemsPerPage = value;

    // Destruir el chart existente si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Verificar que el elemento canvas existe antes de crear el chart
    const canvasElement = document.getElementById(this.isDataStatistic.id) as HTMLCanvasElement;
    if (!canvasElement) {
      // Si el reporte aún no está visible, salir silenciosamente
      if (!this.lookReport()) {
        console.warn(`Canvas '${this.isDataStatistic.id}' no está en el DOM (reporte no visible).`);
        return;
      }
      // Si el reporte está visible pero el DOM aún no ha renderizado el canvas, reintentamos en el siguiente tick
      console.warn(`Canvas '${this.isDataStatistic.id}' no encontrado aún, reintentando...`);
      setTimeout(() => this.onItemsPerPageChange(value), 50);
      return;
    }

    this.config = {
      type: this.itemsPerPage,
      data: {
        labels: this.isDataStatistic.labels,
        datasets: this.buildDatasets(),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    };

    try {
      this.chart = new Chart(canvasElement, this.config);
    } catch (error) {
      console.error('Failed to create chart:', error);
    }
  }
  obtenerUltimosTresAnios() {
    const anioActual = new Date().getFullYear();
    const anios = [];
    for (let i = 0; i < 3; i++) {
      anios.push(anioActual - i);
    }
    return anios;
  }
}
