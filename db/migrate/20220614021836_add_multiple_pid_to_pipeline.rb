class AddMultiplePidToPipeline < ActiveRecord::Migration[6.0]
  def change
    add_column :analysis_pipelines, :multiple_pid, :int, :default=> -1
  end
end

