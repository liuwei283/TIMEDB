class AddDocToAnalysesPipelines < ActiveRecord::Migration[6.0]
  def change
    add_column :analysis_pipelines, :documentation, :text
    add_column :analysis_pipelines, :rendered_doc, :text
  end
end
