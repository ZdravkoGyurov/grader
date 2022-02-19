package config

import (
	"os"
	"path"
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/log"

	"gopkg.in/yaml.v2"
)

const (
	configFileName = "config.yaml"
	secretFileName = "secret.yaml"
)

var configDir = os.Getenv("CONFIG_DIR")

// Config for application properties
type Config struct {
	Host          string `yaml:"host"`
	Port          int    `yaml:"port"`
	IngressHost   string `yaml:"ingress_host"`
	UIIngressHost string `yaml:"ui_ingress_host"`
	Server        `yaml:"server"`
	Outbound      `yaml:"outbound"`
	DB            `yaml:"db"`
	JobExecutor   `yaml:"job_executor"`
	Gitlab        `yaml:"gitlab"`
	Auth          `yaml:"auth"`
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
	Host string `yaml:"host"`
}

type Gitlab struct {
	Host            string `yaml:"host"`
	ClientID        string `yaml:"client_id"`
	ClientSecret    string `yaml:"client_secret"`
	AdminUserID     string `yaml:"admin_user_id"`
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

	configFile, err := os.ReadFile(path.Join(configDir, configFileName))
	if err != nil {
		return cfg, err
	}
	secretFile, err := os.ReadFile(path.Join(configDir, secretFileName))
	if err != nil {
		return cfg, err
	}

	err = yaml.Unmarshal(configFile, &cfg)
	if err != nil {
		return cfg, err
	}
	err = yaml.Unmarshal(secretFile, &cfg)
	if err != nil {
		return cfg, err
	}

	log.DefaultLogger().Info().Msgf("loaded config: %+v", cfg)
	return cfg, nil
}
