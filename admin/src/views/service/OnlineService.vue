<script setup>
// 在线客服
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getChatSessions, getChatSession, replyChat, closeChat } from '@/api'

const sessions = ref([])
const active = ref(null)
const reply = ref('')

async function load() { sessions.value = await getChatSessions() }
onMounted(load)

async function open(s) {
  active.value = await getChatSession(s.id)
  if (s.unread) { s.unread = 0 }
}
async function send() {
  if (!reply.value.trim() || !active.value) return
  active.value = await replyChat(active.value.id, reply.value.trim())
  reply.value = ''
  load()
}
async function finish() {
  if (!active.value) return
  await closeChat(active.value.id); ElMessage.success('会话已结束')
  active.value = await getChatSession(active.value.id); load()
}
</script>

<template>
  <div class="page-container">
    <div class="chat-wrap app-card">
      <div class="session-list">
        <div class="list-head">会话列表</div>
        <div
          v-for="s in sessions" :key="s.id"
          class="session-item" :class="{ active: active && active.id === s.id }"
          @click="open(s)"
        >
          <span class="avatar">{{ s.avatar }}</span>
          <div class="meta">
            <div class="row1"><span class="cust">{{ s.customer }}</span><span class="time">{{ s.updateTime.slice(11) }}</span></div>
            <div class="last">{{ s.lastMsg }}</div>
          </div>
          <el-badge v-if="s.unread" :value="s.unread" class="badge" />
          <el-tag v-if="s.status === 'closed'" size="small" type="info" effect="plain">已结束</el-tag>
        </div>
      </div>

      <div class="chat-main">
        <template v-if="active">
          <div class="chat-head">
            <span>{{ active.customer }}（{{ active.phone }}）</span>
            <el-button size="small" type="danger" plain :disabled="active.status === 'closed'" @click="finish">结束会话</el-button>
          </div>
          <div class="chat-body">
            <div v-for="(m, i) in active.messages" :key="i" class="msg" :class="m.from">
              <div class="bubble">{{ m.text }}</div>
              <div class="mtime">{{ m.time }}</div>
            </div>
          </div>
          <div class="chat-input">
            <el-input v-model="reply" placeholder="输入回复内容…" :disabled="active.status === 'closed'" @keyup.enter="send" />
            <el-button type="primary" :disabled="active.status === 'closed'" @click="send">发送</el-button>
          </div>
        </template>
        <el-empty v-else description="请选择左侧会话" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-wrap { display: flex; height: calc(100vh - 140px); padding: 0; overflow: hidden; }
.session-list { width: 280px; border-right: 1px solid #eef0f3; overflow-y: auto; }
.list-head { padding: 14px 16px; font-weight: 600; border-bottom: 1px solid #eef0f3; }
.session-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f5f6f8; }
.session-item:hover, .session-item.active { background: #f0f7ff; }
.avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#3A8EF6,#26C6DA); color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.meta { flex: 1; min-width: 0; }
.row1 { display: flex; justify-content: space-between; }
.cust { font-weight: 600; font-size: 14px; }
.time { color: #aaa; font-size: 12px; }
.last { color: #999; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-main { flex: 1; display: flex; flex-direction: column; }
.chat-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid #eef0f3; font-weight: 600; }
.chat-body { flex: 1; overflow-y: auto; padding: 18px; background: #f7f9fc; }
.msg { margin-bottom: 16px; display: flex; flex-direction: column; }
.msg.customer { align-items: flex-start; }
.msg.agent { align-items: flex-end; }
.bubble { max-width: 70%; padding: 10px 14px; border-radius: 10px; font-size: 14px; }
.msg.customer .bubble { background: #fff; border: 1px solid #eef0f3; }
.msg.agent .bubble { background: #3A8EF6; color: #fff; }
.mtime { color: #bbb; font-size: 11px; margin-top: 4px; }
.chat-input { display: flex; gap: 10px; padding: 14px 18px; border-top: 1px solid #eef0f3; }
</style>
