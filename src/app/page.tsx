
'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen bg-white flex items-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-finovate-orange/5 rounded-full blur-3xl animate-float"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float-slow"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-20 right-20 w-20 h-20 border-2 border-finovate-orange/20 rotate-45"
            animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-32 left-20 w-16 h-16 bg-finovate-orange/10 rounded-full"
            animate={{ scale: [1, 1.5, 1], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 left-10 w-12 h-12 bg-blue-500/10 rounded-lg rotate-12"
            animate={{ rotate: [12, 45, 12], y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="container-max relative z-10">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-finovate-navy mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Контроль и управление
              <motion.span
                className="text-finovate-orange block mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                личными финансами
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Ваш надежный помощник в Казахстане. Располагаемся деньгами правильно.
            </motion.p>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/registration" className="block bg-finovate-orange hover:bg-finovate-orange-hover text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all shadow-2xl hover:shadow-finovate-orange/25">
                  Начать
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/*<section className="py-20 bg-white">*/}
      {/*  <div className="container-max">*/}
      {/*    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">*/}
      {/*      <motion.div*/}
      {/*        className="text-center group"*/}
      {/*        initial={{ opacity: 0, y: 30 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        transition={{ duration: 0.6, delay: 0.1 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        whileHover={{ y: -5 }}*/}
      {/*      >*/}
      {/*        <div className="text-4xl md:text-5xl font-bold text-finovate-orange mb-3 group-hover:scale-110 transition-transform">10K+</div>*/}
      {/*        <div className="text-gray-600 font-medium">Активных пользователей</div>*/}
      {/*        <div className="w-12 h-1 bg-finovate-orange mx-auto mt-4 rounded-full group-hover:w-16 transition-all"></div>*/}
      {/*      </motion.div>*/}
      {/*      <motion.div*/}
      {/*        className="text-center group"*/}
      {/*        initial={{ opacity: 0, y: 30 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        transition={{ duration: 0.6, delay: 0.2 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        whileHover={{ y: -5 }}*/}
      {/*      >*/}
      {/*        <div className="text-4xl md:text-5xl font-bold text-finovate-orange mb-3 group-hover:scale-110 transition-transform">₸50М+</div>*/}
      {/*        <div className="text-gray-600 font-medium">Сэкономлено на кредитах</div>*/}
      {/*        <div className="w-12 h-1 bg-finovate-orange mx-auto mt-4 rounded-full group-hover:w-16 transition-all"></div>*/}
      {/*      </motion.div>*/}
      {/*      <motion.div*/}
      {/*        className="text-center group"*/}
      {/*        initial={{ opacity: 0, y: 30 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        transition={{ duration: 0.6, delay: 0.3 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        whileHover={{ y: -5 }}*/}
      {/*      >*/}
      {/*        <div className="text-4xl md:text-5xl font-bold text-finovate-orange mb-3 group-hover:scale-110 transition-transform">₸100М+</div>*/}
      {/*        <div className="text-gray-600 font-medium">Инвестировано</div>*/}
      {/*        <div className="w-12 h-1 bg-finovate-orange mx-auto mt-4 rounded-full group-hover:w-16 transition-all"></div>*/}
      {/*      </motion.div>*/}
      {/*      <motion.div*/}
      {/*        className="text-center group"*/}
      {/*        initial={{ opacity: 0, y: 30 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        transition={{ duration: 0.6, delay: 0.4 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        whileHover={{ y: -5 }}*/}
      {/*      >*/}
      {/*        <div className="text-4xl md:text-5xl font-bold text-finovate-orange mb-3 group-hover:scale-110 transition-transform">99%</div>*/}
      {/*        <div className="text-gray-600 font-medium">Довольных клиентов</div>*/}
      {/*        <div className="w-12 h-1 bg-finovate-orange mx-auto mt-4 rounded-full group-hover:w-16 transition-all"></div>*/}
      {/*      </motion.div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Why Choose Qazinv Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-finovate-orange/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container-max relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center text-finovate-navy mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Почему выбирают Qazinv
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <motion.svg
                    className="w-16 h-16 text-finovate-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                ),
                title: "Безопасность и надежность",
                description: "Мы гарантируем безопасность ваших данных и финансовых операций"
              },
              {
                icon: (
                  <motion.svg
                    className="w-16 h-16 text-finovate-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </motion.svg>
                ),
                title: "Быстрое принятие решений",
                description: "Получайте решения по кредитам и инвестициям в кратчайшие сроки"
              },
              {
                icon: (
                  <motion.svg
                    className="w-16 h-16 text-finovate-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </motion.svg>
                ),
                title: "Прозрачность",
                description: "Все условия и процентные ставки отображаются прозрачно и понятно"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-10 rounded-3xl bg-white hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-finovate-orange/20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                whileHover={{
                  y: -15,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
              >
                <motion.div
                  className="flex justify-center mb-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-finovate-navy mb-6">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="py-32 bg-finovate-navy text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-finovate-orange/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        </motion.div>

        <div className="container-max relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Наши цели
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.h3
                className="text-3xl font-bold mb-8 text-finovate-orange"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Делаем финансы понятными
              </motion.h3>
              <motion.p
                className="text-xl mb-12 text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Мы стремимся к тому, чтобы каждый человек мог легко разобраться в финансовых вопросах,
                понимал последствия своих решений и мог уверенно планировать своё финансовое будущее.
              </motion.p>
              <div className="space-y-6">
                {[
                  "Повышаем финансовую грамотность",
                  "Помогаем принимать обоснованные решения",
                  "Делаем инструменты доступными для всех"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center group"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                  >
                    <motion.div
                      className="w-8 h-8 bg-finovate-orange/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-finovate-orange/30 transition-colors duration-300"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg className="w-4 h-4 text-finovate-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <span className="text-lg group-hover:text-white transition-colors duration-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 hover:border-finovate-orange/50 transition-all duration-500"
                whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.h4
                  className="text-2xl font-bold mb-8 text-finovate-orange"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Наша миссия
                </motion.h4>
                <motion.p
                  className="text-lg text-gray-300 leading-relaxed mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  Создать удобную экосистему, которая помогает людям принимать осознанные финансовые решения и уверенно управлять своими деньгами.
                </motion.p>
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-finovate-orange/20 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-6 h-6 text-finovate-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <span className="text-finovate-orange font-semibold">Движемся вперед вместе</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-finovate-orange/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-finovate-navy/20 rounded-full blur-3xl animate-float-delayed"></div>
        </motion.div>

        <div className="container-max relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center text-finovate-navy mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Наши услуги
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Link href="/loan" className="group block">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-finovate-orange/50 h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="w-20 h-20 bg-finovate-orange/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-finovate-orange/20 transition-colors duration-300">
                      <svg className="w-10 h-10 text-finovate-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <motion.h3
                      className="text-2xl font-bold text-finovate-navy mb-4 group-hover:text-finovate-orange transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Кредитный калькулятор
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 leading-relaxed mb-6 text-base"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Умный калькулятор, позволяющий сравнивать предложения и получать персонализированные базовые рекомендации по кредитным действиям.
                    </motion.p>
                    <motion.div
                      className="flex items-center text-finovate-orange font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      Рассчитать
                      <motion.svg
                        className="w-5 h-5 ml-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Link href="/invest" className="group block">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-finovate-orange/50 h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="w-20 h-20 bg-finovate-orange/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-finovate-orange/20 transition-colors duration-300">
                      <svg className="w-10 h-10 text-finovate-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <motion.h3
                      className="text-2xl font-bold text-finovate-navy mb-4 group-hover:text-finovate-orange transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Инвестиционный портфель
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 leading-relaxed mb-6 text-base"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      Создание и тестирование инвестиционных стратегий в демо-среде на основе фундаментального анализа.
                    </motion.p>
                    <motion.div
                      className="flex items-center text-finovate-orange font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      Начать инвестировать
                      <motion.svg
                        className="w-5 h-5 ml-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Link href="/tracker" className="group block">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-finovate-orange/50 h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="w-20 h-20 bg-finovate-orange/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-finovate-orange/20 transition-colors duration-300">
                      <svg className="w-10 h-10 text-finovate-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <motion.h3
                      className="text-2xl font-bold text-finovate-navy mb-4 group-hover:text-finovate-orange transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      Планирование бюджета
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 leading-relaxed mb-6 text-base"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      Эффективное управление доходами и расходами, установка финансовых целей с визуальной аналитикой
                    </motion.p>
                    <motion.div
                      className="flex items-center text-finovate-orange font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      Начать планирование
                      <motion.svg
                        className="w-5 h-5 ml-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-finovate-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-finovate-orange/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
        <div className="container-max relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Начните свой путь к финансовой свободе
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Присоединяйтесь к тысячам пользователей, которые уже используют Qazinv для управления своими финансами
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/loan" className="block bg-finovate-orange hover:bg-finovate-orange-hover text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-finovate-orange/25">
                  Рассчитать кредит
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/invest" className="block bg-white text-finovate-navy hover:bg-gray-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-white/25">
                  Начать инвестировать
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/tracker" className="block border-2 border-white text-white hover:bg-white hover:text-finovate-navy px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300">
                  Планировать бюджет
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}