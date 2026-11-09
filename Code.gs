function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  const requestId = safeRequestId_(params.requestId);
  const result = saveWish_(params, requestId);
  return reply_(requestId, result.ok, result.message);
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const requestId = safeRequestId_(params.requestId);
  const callback = String(params.callback || '');
  if (!/^wishboardCallback_[a-zA-Z0-9_-]+$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback.')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  const result = saveWish_(params, requestId);
  const payload = JSON.stringify({
    type: 'wishboard-result',
    requestId: requestId,
    ok: result.ok,
    message: result.message
  });
  return ContentService.createTextOutput(callback + '(' + payload + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function saveWish_(params, requestId) {
  if (params.action !== 'saveWish') {
    return { ok: false, message: 'Yêu cầu không hợp lệ.' };
  }

  if (params.website) {
    return { ok: true, message: '' };
  }

  const wish = {
    id: clean_(params.id),
    to: clean_(params.to),
    subject: clean_(params.subject),
    from: clean_(params.from),
    text: clean_(params.text)
  };
  if (!wish.id || wish.id.length > 60 ||
      !wish.to || wish.to.length > 40 ||
      wish.subject.length > 40 ||
      wish.from.length > 40 ||
      !wish.text || wish.text.length > 400) {
    return { ok: false, message: 'Thông tin lời chúc không hợp lệ hoặc vượt quá độ dài cho phép.' };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      return { ok: false, message: 'Không tìm thấy Google Sheet được liên kết với Apps Script.' };
    }

    let sheet = spreadsheet.getSheetByName('Lời chúc');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Lời chúc');
      sheet.appendRow(['Mã', 'Người nhận', 'Môn / chức vụ', 'Người gửi', 'Lời chúc', 'Thời gian']);
    }
    sheet.appendRow([
      safeCell_(wish.id),
      safeCell_(wish.to),
      safeCell_(wish.subject),
      safeCell_(wish.from),
      safeCell_(wish.text),
      new Date()
    ]);
    return { ok: true, message: '' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Máy chủ chưa lưu được lời chúc. Vui lòng thử lại sau.' };
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function clean_(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function safeCell_(value) {
  return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value;
}

function safeRequestId_(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
}

function reply_(requestId, ok, message) {
  const payload = JSON.stringify({
    type: 'wishboard-result',
    requestId: requestId,
    ok: ok,
    message: message
  });
  const html = '<!doctype html><html><body><script>window.top.postMessage(' +
    payload +
    ', "*");</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
