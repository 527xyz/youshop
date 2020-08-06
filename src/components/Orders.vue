<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" :span="2" v-model=requestInfo.query>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width=150></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width=150>
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status=='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width=150></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width=200>
          <template slot-scope="scope">{{ timestampToTime(scope.row.create_time)}}</template>
        </el-table-column>
        <el-table-column  label="操作" width=150>
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showAddress"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showLogistics"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="requestInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!--  修改地址-->
      <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%" @close="addressFromClear">
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="city"
              :props="{ expandTrigger: 'hover' }"
              ref="cascader"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 物流信息 -->
      <el-dialog title="物流信息" :visible.sync="logistics" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in logisticsList"
            :key="index"
            :timestamp="item.time"
          >{{item.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import city from "../assets/city";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      //请求参数
      requestInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //订单数量
      total: 0,
      //订单数据
      orderList: [],
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },

      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区县",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },
      city,
      logistics: false,
      logisticsList: [],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //获取订单列表
    getOrderList() {
      this.$axios.get("orders", { params: this.requestInfo }).then((res) => {
        this.total = res.data.total;
        this.orderList = res.data.goods;
        // console.log(this.requestInfo.query)
      });
    },
    //分页器改变每页显示条数时
    handleSizeChange(newSize) {
      this.requestInfo.pagesize = newSize;
      this.getOrderList();
    },
    //分页器切换页码时
    handleCurrentChange(newPage) {
      this.requestInfo.pagenum = newPage;
      this.getOrderList();
    },
    //显示修改地址对话框
    showAddress() {
      this.dialogVisible = true;
    },
    //关闭对话框时清空输入框地址信息
    addressFromClear() {
      this.$refs.addressFormRef.resetFields();
    },
    //获取物流信息
    showLogistics(isSend) {
      this.logistics = true;
      this.$axios.get("kuaidi/1106975712662").then((res) => {
        this.logisticsList = res.data;
      });
    },
    //时间戳转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + "-";
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var D = date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();

      return (
        Y +
        this.addZero(M) +
        "-" +
        this.addZero(D) +
        " " +
        this.addZero(h) +
        ":" +
        this.addZero(m) +
        ":" +
        this.addZero(s)
      );
    },
    //补零
    addZero(n) {
      n = n.toString();
      if (n.length == 1) {
        return "0" + n;
      } else {
        return n;
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getOrderList();
    // console.log(this.timestampToTime(1592797159));
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  scoped>
</style>