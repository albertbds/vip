import { Card } from "./ui/card"
import { Spotlight } from "./ui/spotlight"
import { CNPJConsult } from "./CNPJConsult";
import { Zap, Wifi, Shield } from 'lucide-react';
 
export function SplineSceneBasic() {
  return (
    <>
      <Card className="w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden rounded-2xl">
        <Spotlight
          className="-top-20 left-0 md:left-40 md:-top-10"
          fill="white"
        />
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-6">
              EM BREVE O ACESSO A PLATAFORMA SERÁ PAGO XD
            </h1>
            
            <p className="text-lg text-gray-300 mb-12 max-w-2xl">
              Atualizado Ebook de junho!!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ultra Velocidade</h3>
                <p className="text-gray-400">Até 920 Mega de velocidade para todas suas atividades online.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-secondary/10">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wifi className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Wi-Fi 6</h3>
                <p className="text-gray-400">Tecnologia de última geração para uma conexão mais estável e rápida.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-accent/10">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">100% Fibra</h3>
                <p className="text-gray-400">Infraestrutura completa em fibra óptica.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <CNPJConsult />
    </>
  )
}