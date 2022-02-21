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

{{- define "grader.jobexecutor.configmap.name" -}}
{{ template "grader.name" . }}-job-executor-config
{{- end -}}

{{- define "grader.ui.configmap.name" -}}
{{ template "grader.name" . }}-ui-config
{{- end -}}

# Deployment

{{- define "grader.grader.deployment.name" -}}
{{ template "grader.name" . }}-deployment
{{- end -}}

{{- define "grader.jobexecutor.deployment.name" -}}
{{ template "grader.name" . }}-job-executor-deployment
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

{{- define "grader.jobexecutor.networkpolicy.name" -}}
{{ template "grader.name" . }}-job-executor-networkpolicy
{{- end -}}

{{- define "grader.ui.networkpolicy.name" -}}
{{ template "grader.name" . }}-ui-networkpolicy
{{- end -}}

# Secret

{{- define "grader.grader.secret.name" -}}
{{ template "grader.name" . }}-secret
{{- end -}}

{{- define "grader.jobexecutor.secret.name" -}}
{{ template "grader.name" . }}-job-executor-secret
{{- end -}}

# Service

{{- define "grader.grader.service.name" -}}
{{ template "grader.name" . }}-service
{{- end -}}

{{- define "grader.jobexecutor.service.name" -}}
{{ template "grader.name" . }}-job-executor-service
{{- end -}}

{{- define "grader.ui.service.name" -}}
{{ template "grader.name" . }}-ui-service
{{- end -}}

# Namespace

{{- define "grader.jobs.namespace.name" -}}
{{ template "grader.name" . }}-jobs
{{- end -}}

# ServiceAccount

{{- define "grader.jobexecutor.serviceaccount.name" -}}
{{ template "grader.name" . }}-job-executor-serviceaccount
{{- end -}}

# Role

{{- define "grader.jobs.role.name" -}}
{{ template "grader.name" . }}-pod-creator-role
{{- end -}}

# RoleBinding

{{- define "grader.jobs.rolebinding.name" -}}
{{ template "grader.name" . }}-job-executor-pod-creator-rolebinding
{{- end -}}
