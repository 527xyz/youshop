<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTableLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://47.115.124.102:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model=addForm.goods_introduce min-heigth=300px ></quill-editor>
               <el-button type="primary" class="add" @click=add>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="imgDialog" width="40%" >
      <img :src="imgurl" alt="" class="pvwimg">
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import _ from "lodash";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品类别",
            trigger: "blur",
          },
        ],
      },
      cateList: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      imgurl: "",
      imgDialog:false
    };
  },
  //监听属性 类似于data概念
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getCateList() {
      this.$axios
        .get("categories")
        .then((res) => {
          //   console.log(res);
          this.cateList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //级联选择器
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
    },
    //tabs切换前
    beforeTableLeave(ActiveName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length != 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
      // console.log(this.addForm.goods_cat)
    },
    //切换tabs
    tabClick() {
      if (this.activeIndex === "1") {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            res.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
            });
            this.manyTableData = res.data;
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.activeIndex === "2") {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            this.onlyTableData = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //图片预览
    handlePreview(file) {
      // console.log(file.response.data.url)
      this.imgurl = file.response.data.url;
      this.imgDialog=true
    },
    //移除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const idx = this.addForm.pics.findIndex((x) => x.pic === filePath);
      this.addForm.pics.splice(idx, 1);
    },
    //上传成功
    handleSuccess(res) {
      const picPath = { pic: res.data.tmp_path };
      this.addForm.pics.push(picPath);
    },
    //添加商品
    add(){
        this.$refs.addFormRef.validate(valid=>{
            if(!valid){
                return this.$message.error("请填写必填项")
            }
            const form=_.cloneDeep(this.addForm)
            form.goods_cat=form.goods_cat.join(",")
            
            this.manyTableData.forEach(item=>{
                const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(" ")}
                this.addForm.attrs.push(newInfo)
                
            })
            this.onlyTableData.forEach(item=>{
                const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals}
                this.addForm.attrs.push(newInfo)
            })
            form.attrs=this.addForm.attrs
            this.$axios.post('goods',form).then(res=>{
                console.log(res)
                if(res.meta.status===201){
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods')
                }else{
                    this.$message.error(`${res.meta.msg}`)
                }
            }).catch(err=>{
                console.log(err)
            })
        })
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCateList();
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
<style lang='less' scoped>
.el-steps {
  margin: 15px 0;
}
.el-step {
  font-size: 12px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.pvwimg{
    width:550px
}
.add{
    margin-top:15px
}
</style>