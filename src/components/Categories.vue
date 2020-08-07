<!--  -->
<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>
			<tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
					<i class="el-icon-error" v-else style="color: red"></i>
				</template>
				<template slot="order" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
					<el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
				</template>
				<template slot="opt" slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.id)">删除</el-button>
				</template>
			</tree-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			  :page-sizes="[3, 6, 9, 12]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		
		<el-dialog
		  title="添加分类"
		  :visible.sync="addCateDialogVisible"
		  width="40%" @close="addclose">
		  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="90px">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="addCateForm.cat_name"></el-input>
		    </el-form-item>
			<!-- 级联选择器 -->
			<el-form-item label="父级分类:">
					 <el-cascader
					 	v-model="selectedKeys"
					 	:options="catelist"
					 	:props="{ checkStrictly: true,expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
						
					 	@change="handleChange" clearable style="width: 417px;"></el-cascader>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addCateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCate">确 定</el-button>
		  </span>
		</el-dialog>
		
		<el-dialog
		  title="修改分类"
		  :visible.sync="editDialogVisible"
		  width="40%" @close="editClose">
		  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="editForm.cat_name"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="saveCateInfo">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	
	export default {
		
		// components: {},
		data() {
			return {
				queryInfo:{
					type:3,
					pagenum:1,
					pagesize:6
				},
				catelist:[],
				total:0,
				columns:[
					{
						label:"分类名称",
						prop:"cat_name"
					},
					{
						label:'是否有效',
						type:'template',
						template:'isok'
					},
					{
						label:'排序',
						type:'template',
						template:'order'
					},
					{
						label:'操作',
						type:'template',
						template:'opt'
					}
				],
				addCateDialogVisible:false,
				addCateForm:{
					cat_name:"",
					cat_pid:0,
					cat_level:0
				},
				addCateFormRules:{
					cat_name:[
						{
						  required:true,message:'请输入分类名称',trigger:'blur'
						},
					]
				},
				// parentCateList:[],
				selectedKeys:[],
				// cascaderProps:{
				// 	value:'cat_id',
				// 	label:'cat_name',
				// 	children:'children'
				// }
				editDialogVisible:false,
				editForm:{},
				editFormRules: {
				        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
				},
				// editInfo:{
				// 	cat_name:""
				// }
			};
		},
		//监听属性 类似于data概念
		computed: {},
		//监控data中的数据变化
		watch: {},
		//方法集合
		methods: {
			async getCateList(){
				let res = await this.$axios.get('categories',{
					params:this.queryInfo
				})
				console.log(res.data)
				this.catelist = res.data.result
				this.total = res.data.total
			},
			
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getCateList()
			},
			
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getCateList()
			},
			
			showAddCateDialog(){
				this.getParentCateList()
				this.addCateDialogVisible = true
			},
			
			async getParentCateList(){
				const { data: res } = await this.$axios.get('categories',{
					params: { type: 2 }
				})
				console.log(res)
				this.parentCateList = res.data
			},
			
			handleChange(){
				console.log(this.selectedKeys)
				if (this.selectedKeys.length > 0){
					this.addCateForm.cat_pid = this.selectedKeys[
						this.selectedKeys.length -1
					]
					this.addCateForm.cat_level = this.selectedKeys.length
					return
				} else{
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}
			},
			
			addCate(){
				this.$refs.addCateFormRef.validate(async valid =>{
					if (!valid) return
					const res = await this.$axios.post('categories',this.addCateForm)
					this.$message.success('添加分类成功！')
					this.getCateList()
					this.addCateDialogVisible = false
				})
			},
			// 对话框重置表单
			addclose(){
				this.$refs.addCateFormRef.resetFields()
				this.selectedKeys = []
				this.addCateForm.cat_level = 0
				this.addCateForm.cat_pid = 0
			},
			
			removeCate:async function(cateId){
			    let res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
			      confirmButtonText: '确定',
			      cancelButtonText: '取消',
			      type: 'warning'
			    }).catch(err=>err)
			    if(res=="cancel"){
			      this.$message.info("已取消删除");
			    }else if(res=="confirm"){
			      this.$axios.delete(`/categories/` + cateId)
			      .then((result)=>{
			        if(result.meta.status==200){
			          this.getCateList()
			          this.$message.success("已删除该用户");
			        }else{
			          this.$message.info("删除失败");
			        }
			      })
			    }
			},
			
			 async showEditDialog(cat_id) {
				 this.editDialogVisible = true
			      const { data: res } = await this.$axios.get(`categories/$(this.cateId)`)
			      // if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
			      this.editForm = res.data
			      
			    },
			
			editClose(){
				this.$refs.editFormRef.resetFields()
			},
			
			saveCateInfo() {
			      this.$refs.editFormRef.validate(async valid => {
			        if (!valid) return
			        const { data: res } = await this.$axios.put('categories/' + this.editForm.cat_id, {
			          cat_name: this.editForm.cat_name
			        })
			
			        // if (res.meta.status !== 200) return this.$message.error('更新分类失败！')
			        this.$message.success('更新分类成功！')
			        this.editDialogVisible = false
			        this.getCateList()
			      })
			},
		},
		//生命周期 - 创建完成（可以访问当前this实例）
		created() {
			this.getCateList()
		},
		//生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {
			
		},
		beforeCreate() {}, //生命周期 - 创建之前
		beforeMount() {}, //生命周期 - 挂载之前
		beforeUpdate() {}, //生命周期 - 更新之前
		updated() {}, //生命周期 - 更新之后
		beforeDestroy() {}, //生命周期 - 销毁之前
		destroyed() {}, //生命周期 - 销毁完成
		activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
	}
</script>


<style lang="less" scoped>
  .el-breadcrumb {
    margin: 15px 0;
  }
  
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
	.el-row{
		margin-bottom: 20px;
	}
	.el-pagination{
	  margin-top: 15px;
	}
   }
</style>
