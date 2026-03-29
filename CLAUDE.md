# CLAUDE.md — blog.jcrlabs.net (Blog CMS)

> Dominio: `tech-blog.jcrlabs.net` | Namespace K8s: `blog`

## Principio rector: SIMPLE

La solución más simple que funcione. Sin abstracciones prematuras.

## Stack

- **Backend**: NestJS 11 + MongoDB 8 + GraphQL
- **Frontend**: Next.js 16 (SSG/ISR por post)
- **Deploy**: `tech-blog.jcrlabs.net`

## Tags disponibles

### Cloud Native / Kubernetes
`kubernetes` `k8s` `helm` `kustomize` `argocd` `flux` `gitops`
`service-mesh` `istio` `linkerd` `cilium` `ebpf`
`cert-manager` `external-secrets` `sealed-secrets`
`prometheus` `grafana` `loki` `tempo` `opentelemetry`
`cluster-api` `karpenter` `vcluster` `crossplane`

### Containers / Runtime
`docker` `containerd` `podman` `buildah` `skopeo`
`oci` `wasm` `webassembly` `wasmtime`

### Plataformas & Cloud
`cncf` `openshift` `rancher` `talos` `k3s` `rke2`
`aws` `gcp` `azure` `bare-metal` `homelab`

### IaC & DevOps
`terraform` `pulumi` `ansible` `packer`
`github-actions` `tekton` `jenkins` `dagger`
`sre` `platform-engineering` `devops` `devsecops`

### Lenguajes & Frameworks
`go` `golang` `rust` `typescript` `python`
`nestjs` `nextjs` `react` `htmx`

### Bases de datos & Storage
`postgresql` `mongodb` `redis` `clickhouse` `nats`
`minio` `rook-ceph` `longhorn`

### Seguridad
`falco` `trivy` `kyverno` `opa` `gatekeeper`
`zero-trust` `mtls` `rbac`

### AI / ML
`llm` `mlops` `kubeflow` `ray` `vllm`

## Flujo de ingestión RSS

### Fuentes con aprobación AUTOMÁTICA

Fuentes oficiales de alta confianza. Posts se publican con estado `INGESTED_AUTO` → visible en 10 min.

```typescript
export const AUTO_APPROVE_SOURCES = [
  // Kubernetes oficial
  { name: "Kubernetes Blog", url: "https://kubernetes.io/feed.xml" },
  // CNCF
  { name: "CNCF Blog", url: "https://www.cncf.io/feed/" },
  { name: "CNCF Case Studies", url: "https://www.cncf.io/case-studies/feed/" },
  // dev.to — solo tags K8s/DevOps
  { name: "dev.to kubernetes", url: "https://dev.to/feed/tag/kubernetes" },
  { name: "dev.to devops", url: "https://dev.to/feed/tag/devops" },
  { name: "dev.to docker", url: "https://dev.to/feed/tag/docker" },
  { name: "dev.to cloud", url: "https://dev.to/feed/tag/cloud" },
  { name: "dev.to go", url: "https://dev.to/feed/tag/go" },
  // Proyectos CNCF graduados
  { name: "Prometheus Blog", url: "https://prometheus.io/blog/feed.xml" },
  { name: "Grafana Blog", url: "https://grafana.com/blog/index.xml" },
  { name: "ArgoCD Blog", url: "https://blog.argoproj.io/feed" },
  { name: "Cilium Blog", url: "https://cilium.io/blog/rss.xml" },
  { name: "Flux Blog", url: "https://fluxcd.io/blog/index.xml" },
]
```

### Fuentes con aprobación MANUAL (admin)

Fuentes de calidad pero que requieren revisión antes de publicar.

```typescript
export const MANUAL_APPROVE_SOURCES = [
  // Blogs técnicos de referencia
  { name: "Learnk8s", url: "https://learnk8s.io/rss.xml" },
  { name: "The New Stack", url: "https://thenewstack.io/feed/" },
  { name: "dev.to rust", url: "https://dev.to/feed/tag/rust" },
  { name: "dev.to typescript", url: "https://dev.to/feed/tag/typescript" },
  { name: "dev.to webassembly", url: "https://dev.to/feed/tag/webassembly" },
  { name: "dev.to mlops", url: "https://dev.to/feed/tag/mlops" },
  // Vendors con contenido técnico real
  { name: "HashiCorp Blog", url: "https://www.hashicorp.com/blog/feed.xml" },
  { name: "Weaveworks Blog", url: "https://www.weave.works/blog/feed" },
  { name: "Cloudflare Blog", url: "https://blog.cloudflare.com/rss/" },
  { name: "Tailscale Blog", url: "https://tailscale.com/blog/index.xml" },
  { name: "Fly.io Blog", url: "https://fly.io/blog/feed.xml" },
  { name: "PlanetScale Blog", url: "https://planetscale.com/blog/feed.xml" },
  // Comunidad
  { name: "Hacker News K8s", url: "https://hnrss.org/newest?q=kubernetes" },
  { name: "Hacker News Go", url: "https://hnrss.org/newest?q=golang" },
]
```

## Estados de un post

```
INGESTED_AUTO   → publicado automáticamente (fuentes auto-approve)
INGESTED_MANUAL → pendiente revisión admin (fuentes manual)
PUBLISHED       → publicado por admin o autor
DRAFT           → borrador
REJECTED        → descartado por admin
```

## Cron de ingestión (NestJS)

```typescript
// Cada 6 horas. Simple, sin sobre-ingeniería.
@Cron('0 */6 * * *')
async ingestFeeds() {
  for (const source of [...AUTO_APPROVE_SOURCES, ...MANUAL_APPROVE_SOURCES]) {
    const items = await this.rssService.fetch(source.url)
    for (const item of items) {
      const exists = await this.postModel.findOne({ sourceUrl: item.link })
      if (exists) continue

      const isAuto = AUTO_APPROVE_SOURCES.some(s => s.url === source.url)
      await this.postModel.create({
        title: item.title,
        summary: item.contentSnippet?.slice(0, 500),
        sourceUrl: item.link,
        source: source.name,
        status: isAuto ? PostStatus.INGESTED_AUTO : PostStatus.INGESTED_MANUAL,
        tags: this.extractTags(item),
        publishedAt: isAuto ? new Date() : null,
      })
    }
  }
}
```

## Reglas de ingestión

- Nunca reproducir artículo completo — solo `title`, `summary` (max 500 chars), `sourceUrl`
- Atribución obligatoria: "Vía [source.name]" + link al original
- Si `sourceUrl` ya existe en DB → skip (deduplicación por URL)
- Tags: extraer del feed si existen, sino inferir del título con un map simple

## API pública (GraphQL)

```graphql
query LatestPosts {
  posts(status: PUBLISHED, limit: 5) {
    id title summary tags publishedAt sourceUrl source
  }
}
```

El home (`home.jcrlabs.net`) consume este endpoint para mostrar últimos posts.

## Deploy K8s

```yaml
host: blog.jcrlabs.net
namespace: blog
# Backend: 1-2 replicas (el cron solo corre en 1)
# MongoDB: PVC 5Gi
# Sin Redis (MongoDB es suficiente para este caso)
```

## Qué NO hacer

- No full-text del artículo externo — solo summary + link
- No sistema de usuarios/comentarios en v1
- No ML para tagging — un map simple de palabras clave es suficiente
- No microservicios para el cron — un módulo NestJS más es suficiente

## CI local

Ejecutar **antes de cada commit** para evitar que lleguen errores a GitHub Actions:

```bash
npm run lint
npm run build
```
## Git

- Ramas: `feature/`, `bugfix/`, `hotfix/`, `release/` — sin prefijos adicionales
- Commits: convencional (`feat:`, `fix:`, `chore:`, etc.) — sin mencionar herramientas externas ni agentes en el mensaje
- PRs: título y descripción propios del cambio — sin mencionar herramientas externas ni agentes
- Comentarios y documentación: redactar en primera persona del equipo — sin atribuir autoría a herramientas
