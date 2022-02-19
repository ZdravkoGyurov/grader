{{- define "grader.name" -}}
grader
{{- end -}}

{{- define "grader.chart" -}}
grader
{{- end -}}


# Configmap

{{- define "grader.grader.configmap.name" -}}
{{ template "grader.name" . }}-config
{{- end -}}

{{- define "grader.dockerexecutor.configmap.name" -}}
{{ template "grader.name" . }}-docker-executor-config
{{- end -}}

{{- define "grader.ui.configmap.name" -}}
{{ template "grader.name" . }}-ui-config
{{- end -}}

# Deployment

{{- define "grader.grader.deployment.name" -}}
{{ template "grader.name" . }}-deployment
{{- end -}}

{{- define "grader.dockerexecutor.deployment.name" -}}
{{ template "grader.name" . }}-docker-executor-deployment
{{- end -}}

{{- define "grader.ui.deployment.name" -}}
{{ template "grader.name" . }}-ui-deployment
{{- end -}}

# Ingress

{{- define "grader.grader.ingress.name" -}}
{{ template "grader.name" . }}-ingress
{{- end -}}

# NetworkPolicy

{{- define "grader.grader.networkpolicy.name" -}}
{{ template "grader.name" . }}-networkpolicy
{{- end -}}

{{- define "grader.dockerexecutor.networkpolicy.name" -}}
{{ template "grader.name" . }}-docker-executor-networkpolicy
{{- end -}}

{{- define "grader.ui.networkpolicy.name" -}}
{{ template "grader.name" . }}-ui-networkpolicy
{{- end -}}

# Secret

{{- define "grader.grader.secret.name" -}}
{{ template "grader.name" . }}-secret
{{- end -}}

{{- define "grader.dockerexecutor.secret.name" -}}
{{ template "grader.name" . }}-docker-executor-secret
{{- end -}}

# Service

{{- define "grader.grader.service.name" -}}
{{ template "grader.name" . }}-service
{{- end -}}

{{- define "grader.dockerexecutor.service.name" -}}
{{ template "grader.name" . }}-docker-executor-service
{{- end -}}

{{- define "grader.ui.service.name" -}}
{{ template "grader.name" . }}-ui-service
{{- end -}}
