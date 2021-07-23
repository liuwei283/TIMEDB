class AddUrlToAnalysesAndPipelines < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :url, :string, unique: true
    add_column :analysis_pipelines, :url, :string, unique: true
  end
end
