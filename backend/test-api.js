#!/usr/bin/env node

/**
 * YXOR Team API 测试脚本
 * 使用此脚本测试所有 API 端点
 * 
 * 用法: node test-api.js
 */

const API_URL = 'http://localhost:3001';

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(color, ...args) {
    console.log(colors[color], ...args, colors.reset);
}

async function makeRequest(method, endpoint, body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        return { status: response.status, data };
    } catch (error) {
        return { status: 0, error: error.message };
    }
}

async function runTests() {
    log('cyan', '╔════════════════════════════════════════════════════════════╗');
    log('cyan', '║        YXOR Team API 功能测试                            ║');
    log('cyan', '╚════════════════════════════════════════════════════════════╝');
    log('cyan', '');

    let memberId = null;
    let achievementId = null;
    let applicationId = null;

    // 1. 健康检查
    log('blue', '📋 测试 1: 健康检查');
    let result = await makeRequest('GET', '/api/health');
    if (result.status === 200) {
        log('green', '✅ 通过');
    } else {
        log('red', '❌ 失败');
    }
    console.log('');

    // 2. 获取战队信息
    log('blue', '📋 测试 2: 获取战队信息');
    result = await makeRequest('GET', '/api/team/info');
    if (result.status === 200) {
        log('green', '✅ 通过 -', result.data.name);
    } else {
        log('red', '❌ 失败');
    }
    console.log('');

    // 3. 更新战队信息
    log('blue', '📋 测试 3: 更新战队信息');
    result = await makeRequest('PUT', '/api/team/info', {
        description: '更新于 ' + new Date().toLocaleString()
    });
    if (result.status === 200) {
        log('green', '✅ 通过');
    } else {
        log('red', '❌ 失败', result.data?.error);
    }
    console.log('');

    // 4. 获取所有成员
    log('blue', '📋 测试 4: 获取所有成员');
    result = await makeRequest('GET', '/api/team/members');
    if (result.status === 200) {
        log('green', `✅ 通过 - 共 ${result.data.length} 个成员`);
    } else {
        log('red', '❌ 失败');
    }
    console.log('');

    // 5. 添加成员
    log('blue', '📋 测试 5: 添加新成员');
    result = await makeRequest('POST', '/api/team/members', {
        name: '测试成员',
        role: '测试方向',
        signature: '这是一个测试成员',
        direction: '测试领域'
    });
    if (result.status === 201) {
        memberId = result.data.data.id;
        log('green', `✅ 通过 - ID: ${memberId}`);
    } else {
        log('red', '❌ 失败', result.data?.error);
    }
    console.log('');

    // 6. 获取单个成员
    if (memberId) {
        log('blue', '📋 测试 6: 获取单个成员');
        result = await makeRequest('GET', `/api/team/members/${memberId}`);
        if (result.status === 200) {
            log('green', `✅ 通过 - ${result.data.name}`);
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 7. 更新成员
    if (memberId) {
        log('blue', '📋 测试 7: 更新成员信息');
        result = await makeRequest('PUT', `/api/team/members/${memberId}`, {
            signature: '更新的签名信息'
        });
        if (result.status === 200) {
            log('green', '✅ 通过');
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 8. 获取所有成就
    log('blue', '📋 测试 8: 获取所有成就');
    result = await makeRequest('GET', '/api/team/achievements');
    if (result.status === 200) {
        log('green', `✅ 通过 - 共 ${result.data.length} 个成就`);
    } else {
        log('red', '❌ 失败');
    }
    console.log('');

    // 9. 添加成就
    log('blue', '📋 测试 9: 添加新成就');
    result = await makeRequest('POST', '/api/team/achievements', {
        year: new Date().getFullYear(),
        title: '测试成就',
        award: 'Test Award',
        description: '这是一个测试成就'
    });
    if (result.status === 201) {
        achievementId = result.data.data.id;
        log('green', `✅ 通过 - ID: ${achievementId}`);
    } else {
        log('red', '❌ 失败', result.data?.error);
    }
    console.log('');

    // 10. 更新成就
    if (achievementId) {
        log('blue', '📋 测试 10: 更新成就');
        result = await makeRequest('PUT', `/api/team/achievements/${achievementId}`, {
            title: '更新后的成就标题'
        });
        if (result.status === 200) {
            log('green', '✅ 通过');
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 11. 提交申请
    log('blue', '📋 测试 11: 提交入队申请');
    result = await makeRequest('POST', '/api/team/apply', {
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        skills: 'Web安全',
        message: '我想加入YXOR Team'
    });
    if (result.status === 201) {
        log('green', '✅ 通过');
    } else {
        log('red', '❌ 失败', result.data?.error);
    }
    console.log('');

    // 12. 获取所有申请
    log('blue', '📋 测试 12: 获取所有申请');
    result = await makeRequest('GET', '/api/team/applications');
    if (result.status === 200) {
        log('green', `✅ 通过 - 共 ${result.data.length} 个申请`);
        if (result.data.length > 0) {
            applicationId = result.data[0].id;
        }
    } else {
        log('red', '❌ 失败');
    }
    console.log('');

    // 13. 更新申请状态
    if (applicationId) {
        log('blue', '📋 测试 13: 更新申请状态');
        result = await makeRequest('PATCH', `/api/team/applications/${applicationId}/status`, {
            status: 'reviewed',
            review_notes: '已审核'
        });
        if (result.status === 200) {
            log('green', '✅ 通过');
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 14. 获取统计信息
    log('blue', '📋 测试 14: 获取统计信息');
    result = await makeRequest('GET', '/api/stats');
    if (result.status === 200) {
        log('green', '✅ 通过');
        log('yellow', `   成员数: ${result.data.members}`);
        log('yellow', `   成就数: ${result.data.achievements}`);
        log('yellow', `   申请数: ${result.data.applications}`);
        log('yellow', `   待审批: ${result.data.pendingApplications}`);
    } else {
        log('red', '❌ 失败');
    }
    console.log('');

    // 15. 删除成员（软删除）
    if (memberId) {
        log('blue', '📋 测试 15: 删除成员（软删除）');
        result = await makeRequest('DELETE', `/api/team/members/${memberId}`);
        if (result.status === 200) {
            log('green', '✅ 通过');
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 16. 删除成就
    if (achievementId) {
        log('blue', '📋 测试 16: 删除成就');
        result = await makeRequest('DELETE', `/api/team/achievements/${achievementId}`);
        if (result.status === 200) {
            log('green', '✅ 通过');
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 17. 删除申请
    if (applicationId) {
        log('blue', '📋 测试 17: 删除申请');
        result = await makeRequest('DELETE', `/api/team/applications/${applicationId}`);
        if (result.status === 200) {
            log('green', '✅ 通过');
        } else {
            log('red', '❌ 失败');
        }
        console.log('');
    }

    // 完成
    log('cyan', '╔════════════════════════════════════════════════════════════╗');
    log('cyan', '║              API 测试完成！                              ║');
    log('cyan', '╚════════════════════════════════════════════════════════════╝');
}

// 启动测试
console.log('⏳ 等待服务器连接...');
setTimeout(runTests, 1000);
