"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 장식 요소 */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-blue-900/10 to-transparent -z-10" />

      <main className="container mx-auto px-4 py-20">
        {/* 히어로 섹션 */}
        <section className="flex flex-col items-center text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-12">
              <img src="/logo.png" alt="알리의 손길" className="h-80" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              함께 나누는 <span className="text-blue-900">알리의 손길</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              외국인 근로자를 위한 AI 상담과 커뮤니티 플랫폼
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/login">
              <button className="px-8 py-4 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl">
                커뮤니티 둘러보기
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border-2 border-blue-900 text-blue-900 rounded-full hover:bg-blue-50 transition-colors">
                AI 상담 시작하기
              </button>
            </Link>
          </motion.div>
        </section>

        {/* 특징 섹션 */}
        <section className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: "실시간 커뮤니티",
              description: "다른 근로자들의 경험과 해결책을 함께 나눠보세요",
              icon: "👥",
            },
            {
              title: "AI 법률 상담",
              description: "24시간 언제든 무료로 법률 상담을 받아보세요",
              icon: "💬",
            },
            {
              title: "다국어 지원",
              description: "모국어로 편하게 상담받고 소통하세요",
              icon: "🌏",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        {/* CTA 섹션 */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-900 to-blue-700 p-12 rounded-3xl text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">함께 이야기를 나눠보세요</h2>
          <p className="mb-8 text-lg opacity-90">
            혼자만의 고민이 아닌, 모두의 경험이 될 수 있습니다
          </p>
          <Link href="/login">
            <button className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-colors">
              지금 시작하기
            </button>
          </Link>
        </motion.section>
      </main>
    </div>
  );
}
