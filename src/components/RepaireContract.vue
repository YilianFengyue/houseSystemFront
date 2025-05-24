<template>
  <div class="repair-terms">
    <h1>租房线上报修条款文件</h1>
    
    <section class="term-section">
      <h2>一、总则</h2>
      <p>本条款适用于通过线上平台向房东或物业管理方提交房屋报修申请的租客（以下简称 "报修人"）。</p>
      <p>报修人提交线上报修申请，即视为同意遵守本条款及平台相关规定。</p>
    </section>
    
    <section class="term-section">
      <h2>二、报修范围</h2>
      <h3>可报修项目：</h3>
      <p>因房屋自身质量问题或自然损耗导致的设施设备故障、结构损坏等，如水管破裂、电路故障、门窗损坏、墙面渗水等。</p>
      
      <h3>不可报修项目：</h3>
      <p>因报修人使用不当、故意损坏或自行改造导致的问题，以及因不可抗力（如地震、洪水、台风等）造成的损坏。</p>
    </section>
    
    <section class="term-section">
      <h2>三、报修流程</h2>
      <h3>提交申请：</h3>
      <p>报修人需通过指定线上平台，如实填写报修信息，包括故障描述、拍摄清晰的故障照片或视频、选择预计可维修时间等。</p>
      
      <h3>申请审核：</h3>
      <p>房东或物业管理方在收到报修申请后的 {{ auditDays }} 个工作日内完成审核。审核通过的，进入维修安排阶段；审核不通过的，需向报修人说明原因。</p>
      
      <h3>维修安排：</h3>
      <p>审核通过后，房东或物业管理方应在 {{ arrangeDays }} 个工作日内安排维修人员上门维修，并提前与报修人沟通具体上门时间。</p>
      
      <h3>维修验收：</h3>
      <p>维修完成后，报修人需在 {{ acceptDays }} 个工作日内进行验收，并在线上平台反馈验收结果。若验收不合格，需说明具体问题，维修人员应在 {{ reworkDays }} 个工作日内进行返修。</p>
    </section>
    
    <section class="term-section">
      <h2>四、责任与义务</h2>
      <h3>报修人责任</h3>
      <ul>
        <li>报修人应妥善使用房屋及附属设施设备，不得故意损坏。因使用不当导致的维修费用，由报修人承担。</li>
        <li>报修人应积极配合维修人员工作，提供必要的协助和便利，如在约定时间内到场、保持维修区域畅通等。</li>
      </ul>
      
      <h3>房东或物业管理方责任</h3>
      <ul>
        <li>及时审核报修申请，并按约定时间安排维修，确保维修质量。</li>
        <li>对维修过程中产生的垃圾进行清理，恢复维修区域原状（因维修需要无法恢复的情况除外）。</li>
      </ul>
    </section>
    
    <section class="term-section">
      <h2>五、费用承担</h2>
      <p>因房屋自身质量问题或自然损耗产生的维修费用，由房东承担。</p>
      <p>因报修人使用不当、故意损坏或自行改造导致的维修费用，由报修人承担。费用标准参考市场价格或双方协商确定。</p>
      <p>若维修项目涉及公共区域或共用设施设备，维修费用按相关法律法规及物业管理规定执行。</p>
    </section>
    
    <section class="term-section">
      <h2>六、隐私保护</h2>
      <p>房东或物业管理方应妥善保管报修人在报修过程中提供的个人信息，不得泄露、篡改或用于其他非法用途。</p>
      <p>线上平台应采取必要的技术措施和管理措施，保障报修信息的安全。</p>
    </section>
    
    <section class="term-section">
      <h2>七、争议解决</h2>
      <p>如双方在报修及维修过程中发生争议，应首先友好协商解决；协商不成的，可向房屋所在地的人民法院提起诉讼。</p>
    </section>
    
    <section class="term-section">
      <h2>八、其他条款</h2>
      <p>本条款自发布之日起生效，房东或物业管理方有权根据实际情况进行修订。修订后的条款将在原发布平台公布，自公布之日起 {{ reviseDays }} 日后生效。若报修人继续使用线上报修服务，即视为同意修订后的条款。</p>
      <p>本条款未尽事宜，按照国家相关法律法规及行业惯例执行。</p>
    </section>
    
    <div class="accept-box" v-if="showAccept">
      <p>我已阅读并同意以上条款</p>
      <button @click="acceptTerms">同意</button>
      <button @click="rejectTerms">不同意</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RepairTerms',
  data() {
    return {
      auditDays: 2,       // 审核工作日数
      arrangeDays: 3,     // 安排维修工作日数
      acceptDays: 2,      // 验收工作日数
      reworkDays: 2,      // 返修工作日数
      reviseDays: 7,      // 修订生效日数
      showAccept: true    // 是否显示同意按钮
    }
  },
  methods: {
    acceptTerms() {
      this.showAccept = false;
      this.$emit('terms-accepted');
      // 可以添加存储用户已同意的逻辑
    },
    rejectTerms() {
      this.$emit('terms-rejected');
      // 可以添加用户不同意条款的处理逻辑
    }
  }
}
</script>

<style scoped>
.repair-terms {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

h2 {
  margin-top: 25px;
  margin-bottom: 15px;
  color: #34495e;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

h3 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #7f8c8d;
}

.term-section {
  margin-bottom: 20px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}

.accept-box {
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  text-align: center;
}

.accept-box p {
  margin-bottom: 15px;
  font-weight: bold;
}

button {
  padding: 8px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:first-of-type {
  background-color: #42b983;
  color: white;
}

button:last-of-type {
  background-color: #e74c3c;
  color: white;
}
</style>