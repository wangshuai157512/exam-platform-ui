export const CalcColumnsWidth = {
  props: {
    isCalcWidth: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        this.$nextTick(() => {
          if (!this.isCalcWidth) return;

          const columns = this.layout.table.columns;
          const textContainer = document.createElement("span");
          const cellTextNode = [
            ...this.$el.querySelectorAll(".el-table__header-wrapper tr"),
            ...this.$el.querySelectorAll(".el-table__body-wrapper tr")
          ];
          textContainer.classList.add("table-content-text");
          document.getElementById("app").appendChild(textContainer);

          for (let i = 0; i < columns.length; i++) {
            if (columns[i].fixed || i === columns.length - 1) {
              const { minWidth } = columns[i];
              const header = document.querySelector(
                ".el-table__header-wrapper"
              ).offsetWidth;
              const colgroup = document.querySelector(
                ".el-table__header-wrapper colgroup"
              ).offsetWidth;

              if (!value.length || colgroup + minWidth < header)
                columns[i].width = null;
              continue;
            }

            const columnsWidth = cellTextNode.reduce(
              (prev, current, currentIndex) => {
                const currentText = current.querySelectorAll(
                  currentIndex === 0 ? "th" : "td"
                )[i].innerText;

                textContainer.innerText = currentText;

                return prev > textContainer.offsetWidth
                  ? prev
                  : textContainer.offsetWidth;
              },
              0
            );
            columns[i].width = columnsWidth || columns[i].width;
          }
          this.layout.updateColumnsWidth();
          // this.layout.notifyObservers("columns");
          document.getElementById("app").removeChild(textContainer);
        });
      }
    }
  }
};
