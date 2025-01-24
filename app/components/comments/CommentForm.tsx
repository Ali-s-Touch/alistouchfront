"use client";

export default function CommentForm() {
  return (
    <div className="mb-6">
      <textarea
        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
          text-slate-900 placeholder:text-slate-400"
        placeholder="댓글을 입력하세요"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
          댓글 작성
        </button>
      </div>
    </div>
  );
}
