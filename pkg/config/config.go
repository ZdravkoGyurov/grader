package config

import (
	"os"
	"path"
	"time"

	"gopkg.in/yaml.v2"
)

const (
	configDir         = "config"
	appConfigFileName = "app_config.yaml"
)

// Config for application properties
type Config struct {
	Host        string `yaml:"host"`
	Port        int    `yaml:"port"`
	Server      `yaml:"server"`
	Outbound    `yaml:"outbound"`
	DB          `yaml:"db"`
	JobExecutor `yaml:"job_executor"`
	Gitlab      `yaml:"gitlab"`
	Auth        `yaml:"auth"`
}

type Server struct {
	ReadTimeout     time.Duration `yaml:"read_timeout"`
	WriteTimeout    time.Duration `yaml:"write_timeout"`
	ShutdownTimeout time.Duration `yaml:"shutdown_timeout"`
}

type DB struct {
	URI            string        `yaml:"uri"`
	ConnectTimeout time.Duration `yaml:"connect_timeout"`
	RequestTimeout time.Duration `yaml:"request_timeout"`
}

type JobExecutor struct {
	URL string `yaml:"url"`
}

type Gitlab struct {
	Host            string `yaml:"host"`
	RequiredScope   string `yaml:"required_scope"`
	ClientID        string `yaml:"client_id"`
	ClientSecret    string `yaml:"client_secret"`
	GroupParentID   string `yaml:"group_parent_id"`
	GroupParentName string `yaml:"group_parent_name"`
	PAT             string `yaml:"pat"`
}

type Auth struct {
	AccessTokenSecret          string        `yaml:"access_token_secret"`
	AccessTokenExpirationTime  time.Duration `yaml:"access_token_expiration_time"`
	RefreshTokenSecret         string        `yaml:"refresh_token_secret"`
	RefreshTokenExpirationTime time.Duration `yaml:"refresh_token_expiration_time"`
}

type Outbound struct {
	Timeout time.Duration `yaml:"timeout"`
}

func Load() (Config, error) {
	cfg := Config{}

	appConfigFile, err := os.ReadFile(path.Join(configDir, appConfigFileName))
	if err != nil {
		return cfg, err
	}

	err = yaml.Unmarshal(appConfigFile, &cfg)
	if err != nil {
		return cfg, err
	}

	return cfg, nil
}
