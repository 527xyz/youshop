<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            :span="2"
            v-model="requestInfo.query"
            clearable
            @clear="getGoodsList"
            @click="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" class="searchBtn" @click=goodsAdd>添加商品</el-button>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
          <template slot-scope="scope">{{timestampToTime(scope.row.add_time)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGood(scope.row.goods_id)"
            ></el-button>
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
        :total="this.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      requestInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodList: [],
      total: 0,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //获取商品列表
    getGoodsList() {
      this.$axios.get("goods", { params: this.requestInfo }).then((res) => {
        this.goodList = res.data.goods;
        this.total = res.data.total;
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
    handleSizeChange(newsize) {
      this.requestInfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newpage) {
      this.requestInfo.pagenum = newpage;
      this.getGoodsList();
    },
    //删除商品
    delGood(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除商品成功!",
          });
          this.$axios
            .delete(`goods/${id}`)
            .then((res) => {
              this.getGoodsList();
            })
            .catch((err) => {
              console.log(err);
            });
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //添加商品
    goodsAdd(){
      this.$router.push('/goods/add')
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getGoodsList();
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
.searchBtn {
  margin-left: 10px;
}
.el-table {
  font-size: 12px;
}
</style>