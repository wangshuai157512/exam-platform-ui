<script>
import { Table } from "element-ui";
import { CalcColumnsWidth } from "./mixin";

export default {
  name: "ElTable",
  extends: Table,
  mixins: [CalcColumnsWidth]
};
</script>
