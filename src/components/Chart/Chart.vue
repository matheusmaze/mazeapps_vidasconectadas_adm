<template>
  <canvas
    :height="type == 'line' ? '500' : '300'"
    :key="chartId"
    :id="chartId"
  />
</template>

<script lang="ts">
import { onMounted } from "vue";
import Chart from "chart.js";
interface Props {
  chartId?: string | undefined;
  type?: string | undefined;
  color?: string | undefined;
  label?: string | undefined;
  labels?: Array<any> | undefined;
  data?: Array<any> | undefined;
}
export default {
  props: {
    chartId: String || undefined,
    type: String,
    color: String,
    label: String,
    labels: Array,
    data: Array,
  },
  setup(props: Props) {
    onMounted(() => {
      const { chartId }: Props = props;
      const canvas = document.getElementById(
        chartId || ""
      ) as HTMLCanvasElement;

      new Chart(canvas, {
        type: props.type,
        data: {
          labels: props.labels,
          datasets: [
            {
              label: `Quantidade de ${props.label}`,
              data: props.data,
              backgroundColor:
                props.type == "line"
                  ? ["rgba(0,0,0,0)"]
                  : ["#1C74B4", "#1C74B4aa", "#1C74B4bb", "#1C74B4cc"],
              borderColor: [`#1C74B4aa`],
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    });

    return props;
  },
};
</script>

<style>
canvas {
  width: 100%;
}
</style>
